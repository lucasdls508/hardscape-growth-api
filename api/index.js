// Vercel serverless entry point for NestJS
// Uses Express adapter (not Fastify) + serverless-http wrapper
// BullMQ, WebSockets, and Cron are disabled in serverless mode via VERCEL env var
process.env.VERCEL = "1";

const serverlessHttp = require("serverless-http");
let handler;

async function getHandler() {
  if (handler) return handler;

  const express = require("express");
  const expressApp = express();

  const { NestFactory } = require("@nestjs/core");
  const { ExpressAdapter } = require("@nestjs/platform-express");
  const { AppModule } = require("../dist/src/app.module");
  const { ClassSerializerInterceptor, ValidationPipe, VersioningType } = require("@nestjs/common");
  const { Reflector } = require("@nestjs/core");
  const compression = require("compression");
  const cookieParser = require("cookie-parser");
  const helmet = require("helmet");
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
    const { SeederService } = require("../dist/src/seeder/seeder.service");
    const seeder = app.get(SeederService);
    await seeder.seedAdminUser().catch(() => {});
    await seeder.seedSettings().catch(() => {});
  } catch (e) {
    console.warn("Seeder not available:", e.message);
  }

  handler = serverlessHttp(expressApp, {
    binary: ["image/*"],
  });
  return handler;
}

module.exports = async (req, res) => {
  const h = await getHandler();
  return h(req, res);
};
