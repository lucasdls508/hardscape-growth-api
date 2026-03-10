// Vercel serverless entry point for NestJS
// Key: initialization starts at MODULE LOAD time, not request time.
// Vercel's 10s limit applies to request handling, not module initialization.
process.env.VERCEL = "1";

const serverlessHttp = require("serverless-http");

// --- Start initialization immediately at module load ---
// CRITICAL: .catch() must be attached so Node.js 15+ doesn't treat the rejection
// as "unhandled" and crash the process before the first request handler runs.
let initPromise = initApp().catch(err => {
  console.error("[VERCEL INIT FAILED]", err.message, err.stack);
  // Return a minimal handler so requests get a proper JSON error instead of a process crash
  return (req, res) => {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Server initialization failed", message: err.message, stack: err.stack?.split("\n").slice(0, 8) }));
  };
});

async function initApp() {
  const express = require("express");
  const expressApp = express();

  const { NestFactory } = require("@nestjs/core");
  const { ExpressAdapter } = require("@nestjs/platform-express");
  const { AppModule } = require("../dist/src/app.module");
  const { ClassSerializerInterceptor, ValidationPipe, VersioningType } = require("@nestjs/common");
  const { Reflector } = require("@nestjs/core");
  const compression = require("compression");
  const cookieParser = require("cookie-parser");
  const hpp = require("hpp");
  const { urlencoded } = require("express");

  const adapter = new ExpressAdapter(expressApp);
  const app = await NestFactory.create(AppModule, adapter, {
    bodyParser: false,
    logger: ["error", "warn", "log"],
  });

  app.setGlobalPrefix("/api");
  app.enableVersioning({ defaultVersion: "1", type: VersioningType.URI });
  app.enableCors({ origin: "*", methods: ["GET", "POST", "PATCH", "DELETE", "PUT"], allowedHeaders: ["Content-Type", "Authorization"], credentials: true });

  app.use(cookieParser());
  app.use(compression());
  app.use(urlencoded({ extended: true, limit: "50kb" }));
  app.use(hpp());
  app.useGlobalPipes(new ValidationPipe({ transform: true, stopAtFirstError: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // Raw body for Stripe webhook
  expressApp.use("/api/v1/webhook/stripe", (req, _res, next) => {
    let data = [];
    req.on("data", (chunk) => data.push(chunk));
    req.on("end", () => {
      req.rawBody = Buffer.concat(data);
      req.body = req.rawBody;
      next();
    });
  });

  await app.init();

  // Seed admin user (no-op if already exists)
  try {
    const seeder = app.get(require("../dist/src/seeder/seeder.service").SeederService);
    await seeder.seedAdminUser().catch(() => {});
    await seeder.seedSettings().catch(() => {});
  } catch (e) {
    console.warn("Seeder not available:", e.message);
  }

  console.log("[VERCEL] NestJS initialized");
  return serverlessHttp(expressApp, { binary: ["image/*"] });
}

// --- Handle requests ---
module.exports = async (req, res) => {
  try {
    const handler = await initPromise;
    return handler(req, res);
  } catch (err) {
    console.error("[VERCEL INIT ERROR]", err.message);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: err.message, stack: err.stack?.split("\n").slice(0, 5) }));
  }
};
