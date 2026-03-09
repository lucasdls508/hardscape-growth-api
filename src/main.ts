// import configuration from "./configs/app.config";
import { ClassSerializerInterceptor, ValidationPipe, VersioningType } from "@nestjs/common";
import { NestFactory, Reflector } from "@nestjs/core";
// import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";
import compression from "compression";
import cookieParser from "cookie-parser";
import { urlencoded } from "express";
import helmet from "helmet";
import hpp from "hpp";
import { AppModule } from "./app.module";
// FIXME: have it if you are using secret manager
// import { loadSecretsFromAWS } from "./configs/app.config";
import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { IoAdapter } from "@nestjs/platform-socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import bodyParser from "body-parser";
import { join } from "path";
import { createClient } from "redis";
import { createDataSource } from "./configs/ormconfig";
import { runMigrations } from "./migration-runner";
import { SeederService } from "./seeder/seeder.service";

process.on("uncaughtException", (err) => {
  console.error("[FATAL] Uncaught exception:", err.message, err.stack);
  process.exit(1);
});
process.on("unhandledRejection", (reason) => {
  console.error("[FATAL] Unhandled rejection:", reason);
  process.exit(1);
});

async function bootstrap() {
  console.log("[BOOT] Step 1: creating DataSource");
  // Create the data source after secrets are loaded
  const dataSource = createDataSource();
  // Run Auto Migrations
  console.log("[BOOT] Step 2: running migrations");
  await runMigrations(dataSource, false); // Set to true to exit on migration failure
  console.log("[BOOT] Step 3: NestFactory.create");
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {
    bodyParser: true,
    cors: true,
    logger: ["error", "fatal", "log", "verbose", "warn", "debug"],
  });
  console.log("[BOOT] Step 4: app created, getting config");
  const configService = app.get<ConfigService>(ConfigService);
  console.log("[BOOT] Step 5: seeding leads");
  const seed = app.get(SeederService);
  await seed.seedLeeds().catch((e) => console.warn("Lead seed skipped:", e.message));
  console.log("[BOOT] Step 6: Redis adapter setup");
  // --- Add Redis Adapter (optional — gracefully skipped if Redis is unavailable) ---
  const redisUrl = process.env.REDIS_URL || `redis://${process.env.REDIS_IP || "localhost"}:${process.env.REDIS_PORT || 6379}`;
  let pubClient: any, subClient: any;
  try {
    pubClient = createClient({ url: redisUrl });
    subClient = pubClient.duplicate();
    await Promise.all([pubClient.connect(), subClient.connect()]);
    app.useWebSocketAdapter(
      new (class extends IoAdapter {
        createIOServer(port: number, options?: any) {
          const server = super.createIOServer(port, options);
          server.adapter(createAdapter(pubClient, subClient));
          return server;
        }
      })(app)
    );
    console.log("Redis adapter connected:", redisUrl);
  } catch (redisErr) {
    console.warn("Redis unavailable, falling back to in-memory WebSocket adapter:", redisErr.message);
  }
  console.log("[BOOT] Step 7: seeding admin + settings");
  const seederService = app.get(SeederService);
  await seederService.seedAdminUser().catch((e) => console.warn("Admin seed skipped:", e.message));
  await seederService.seedSettings().catch((e) => console.warn("Settings seed skipped:", e.message));

  // await seederService.seedFakeUsers();
  app.setGlobalPrefix("/api");

  app.enableVersioning({
    defaultVersion: "1",
    type: VersioningType.URI,
  });

  console.log("[BOOT] Step 8: setViewEngine");
  app.setViewEngine({
    engine: {
      handlebars: require("handlebars"), // Import the engine here
    },
    templates: join(__dirname, "..", "..", "src", "views"), // Path to your views
    // layout: "layouts/main", // Optional: if you use layouts
  });
  // app.setViewEngine("ejs");

  const corsOptions: CorsOptions = {
    origin: "*", // ✅ frontend origin
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    optionsSuccessStatus: 204,
    maxAge: 86400,
  };
  console.log("[BOOT] Step 9: useStaticAssets");
  app.useStaticAssets({
    root: join(__dirname, "..", "..", "public"),
    prefix: "/public/", // Optional: adds a prefix to the URL
  });
  // app.enableCors(corsOptions);
  app.use(cookieParser());
  app.use(compression());
  // app.use(json({ limit: "50kb" }));
  app.use(urlencoded({ extended: true, limit: "50kb" }));
  // app.init()
  // app.disable("x-powered-by"); // provide an extra layer of obsecurity to reduce server fingerprinting.
  // app.set("trust proxy", 1); // trust first proxy

  const ignoreMethods =
    configService.get<string>("STAGE") == "dev"
      ? ["GET", "HEAD", "OPTIONS", "DELETE", "POST", "PATCH", "PUT"] // for devlopment we ignoring all
      : ["GET", "HEAD", "OPTIONS"];
  // app.use(
  //   csurf({
  //     cookie: {
  //       httpOnly: true, // Prevent JavaScript access to the CSRF cookie
  //       secure: process.env.NODE_ENV === "PROD", // Set to secure only in production
  //       sameSite: "strict", // Restrict the cookie to same-site requests
  //     },
  //     ignoreMethods,
  //   })
  // );
  app.use(
    helmet({
      hsts: {
        includeSubDomains: true,
        preload: true,
        maxAge: 63072000, // 2 years in seconds
      },
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          defaultSrc: ["'self'", "https://polyfill.io", "https://*.cloudflare.com", "http://127.0.0.1:3000/"],
          baseUri: ["'self'"],
          scriptSrc: [
            "'self'",
            "http://127.0.0.1:3000/",
            "https://*.cloudflare.com",
            "https://polyfill.io",
            `https: 'unsafe-inline'`, // FIXME: use script-src CSP NONCES
            /* 
              CSP NONCES https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src#unsafe_inline
             */
          ],
          styleSrc: ["'self'", "https:", "http:", "'unsafe-inline'"],
          imgSrc: ["'self'", "blob:", "validator.swagger.io", "*"],
          fontSrc: ["'self'", "https:", "data:"],
          childSrc: ["'self'", "blob:"],
          styleSrcAttr: ["'self'", "'unsafe-inline'", "http:"],
          frameSrc: ["'self'"],
        },
      },
      // you don't control the link on the pages, or know that you don't want to leak information to other domains
      dnsPrefetchControl: { allow: false }, // Changed based on the last middleware to disable DNS prefetching
      frameguard: { action: "deny" }, // Disable clickjacking
      hidePoweredBy: true, // Hides the X-Powered-By header to make the server less identifiable.
      ieNoOpen: true, // Prevents Internet Explorer from executing downloads in the site’s context.
      noSniff: true, // Prevents browsers from MIME type sniffing, reducing exposure to certain attacks.
      permittedCrossDomainPolicies: { permittedPolicies: "none" }, // Prevents Adobe Flash and Acrobat from loading cross-domain data.
      referrerPolicy: { policy: "no-referrer" }, // Protects against referrer leakage.
      xssFilter: true, // Enables the basic XSS protection in older browsers.

      // Configures Cross-Origin settings to strengthen resource isolation and mitigate certain side-channel attacks.  crossOriginEmbedderPolicy: true,
      crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
      crossOriginResourcePolicy: { policy: "same-site" },
      originAgentCluster: true,
    })
  );

  app.use((req: any, res: any, next: any) => {
    res.setHeader(
      "Permissions-Policy",
      'fullscreen=(self), camera=(), geolocation=(self "https://*example.com"), autoplay=(), payment=(), microphone=()'
    );
    next();
  });

  // app.use(xssClean());
  app.use(hpp());

  app.useGlobalPipes(new ValidationPipe({ transform: true, stopAtFirstError: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  /* FIXME:
    ########################## 
    ##### Set-up Swagger #####
    ##########################
  */
  if (!["prod", "production"].includes(configService.get<string>("STAGE").toLowerCase())) {
    // const config = new DocumentBuilder()
    //   .addBearerAuth()
    //   .setTitle(configService.get<string>("npm_package_name").replaceAll("-", " ").toUpperCase())
    //   .setDescription("DESCRIPTION")
    //   .setVersion(configService.get<string>("npm_package_version"))
    //   .build();
    // const document = SwaggerModule.createDocument(app, config, { ignoreGlobalPrefix: false });
    // SwaggerModule.setup("api", app, document, {
    //   swaggerOptions: {
    //     tagsSorter: "alpha",
    //   },
    // });
  }

  // FIXME:
  // Session Management
  // expressSession(app);

  const port = configService.get<string>("PORT") || process.env.PORT || 3000;
  const host = "0.0.0.0";

  console.log("[BOOT] Step 10: app.init() — port:", port);
  // Initialize the app first so NestJS registers its default JSON content-type parser.
  // Then we replace it with a custom parser that returns the raw Buffer for the Stripe
  // webhook route (required for HMAC verification) and falls back to JSON.parse elsewhere.
  await app.init();
  console.log("[BOOT] Step 11: app.init() complete, setting up content-type parser");
  const fastifyInstance = app.getHttpAdapter().getInstance();
  fastifyInstance.removeContentTypeParser("application/json");
  fastifyInstance.addContentTypeParser("application/json", { parseAs: "buffer" }, function (req: any, body: Buffer, done: any) {
    if (req.url?.includes("/webhook/stripe")) {
      done(null, body);
    } else {
      try {
        done(null, JSON.parse(body.toString("utf8")));
      } catch (err: any) {
        err.statusCode = 400;
        done(err, undefined);
      }
    }
  });

  await app.listen(port, host, () => {
    console.log(`Server started on ${host}:${port}`);
  });
}
bootstrap();
