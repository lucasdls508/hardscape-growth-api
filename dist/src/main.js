"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_1 = require("express");
const helmet_1 = __importDefault(require("helmet"));
const hpp_1 = __importDefault(require("hpp"));
const app_module_1 = require("./app.module");
const platform_fastify_1 = require("@nestjs/platform-fastify");
const platform_socket_io_1 = require("@nestjs/platform-socket.io");
const redis_adapter_1 = require("@socket.io/redis-adapter");
const path_1 = require("path");
const redis_1 = require("redis");
const seeder_service_1 = require("./seeder/seeder.service");
process.on("uncaughtException", (err) => {
    console.error("[FATAL] Uncaught exception:", err.message, err.stack);
    process.exit(1);
});
process.on("unhandledRejection", (reason) => {
    console.error("[FATAL] Unhandled rejection:", reason);
    process.exit(1);
});
async function bootstrap() {
    console.log("[BOOT] Step 1: NestFactory.create (TypeORM sync+migrate runs here)");
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_fastify_1.FastifyAdapter(), {
        bodyParser: true,
        cors: true,
        logger: ["error", "fatal", "log", "verbose", "warn", "debug"],
    });
    console.log("[BOOT] Step 4: app created, getting config");
    const configService = app.get(config_1.ConfigService);
    console.log("[BOOT] Step 5: seeding leads");
    const seed = app.get(seeder_service_1.SeederService);
    await seed.seedLeeds().catch((e) => console.warn("Lead seed skipped:", e.message));
    console.log("[BOOT] Step 6: Redis adapter setup");
    const redisUrl = process.env.REDIS_URL || `redis://${process.env.REDIS_IP || "localhost"}:${process.env.REDIS_PORT || 6379}`;
    let pubClient, subClient;
    try {
        pubClient = (0, redis_1.createClient)({ url: redisUrl });
        subClient = pubClient.duplicate();
        await Promise.all([pubClient.connect(), subClient.connect()]);
        app.useWebSocketAdapter(new (class extends platform_socket_io_1.IoAdapter {
            createIOServer(port, options) {
                const server = super.createIOServer(port, options);
                server.adapter((0, redis_adapter_1.createAdapter)(pubClient, subClient));
                return server;
            }
        })(app));
        console.log("Redis adapter connected:", redisUrl);
    }
    catch (redisErr) {
        console.warn("Redis unavailable, falling back to in-memory WebSocket adapter:", redisErr.message);
    }
    console.log("[BOOT] Step 7: seeding admin + settings");
    const seederService = app.get(seeder_service_1.SeederService);
    await seederService.seedAdminUser().catch((e) => console.warn("Admin seed skipped:", e.message));
    await seederService.seedSettings().catch((e) => console.warn("Settings seed skipped:", e.message));
    app.setGlobalPrefix("/api");
    app.enableVersioning({
        defaultVersion: "1",
        type: common_1.VersioningType.URI,
    });
    console.log("[BOOT] Step 8: setViewEngine");
    app.setViewEngine({
        engine: {
            handlebars: require("handlebars"),
        },
        templates: (0, path_1.join)(__dirname, "..", "..", "src", "views"),
    });
    const corsOptions = {
        origin: "*",
        methods: ["GET", "POST", "PATCH", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
        optionsSuccessStatus: 204,
        maxAge: 86400,
    };
    console.log("[BOOT] Step 9: useStaticAssets");
    app.useStaticAssets({
        root: (0, path_1.join)(__dirname, "..", "..", "public"),
        prefix: "/public/",
    });
    app.use((0, cookie_parser_1.default)());
    app.use((0, compression_1.default)());
    app.use((0, express_1.urlencoded)({ extended: true, limit: "50kb" }));
    const ignoreMethods = configService.get("STAGE") == "dev"
        ? ["GET", "HEAD", "OPTIONS", "DELETE", "POST", "PATCH", "PUT"]
        : ["GET", "HEAD", "OPTIONS"];
    app.use((0, helmet_1.default)({
        hsts: {
            includeSubDomains: true,
            preload: true,
            maxAge: 63072000,
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
                    `https: 'unsafe-inline'`,
                ],
                styleSrc: ["'self'", "https:", "http:", "'unsafe-inline'"],
                imgSrc: ["'self'", "blob:", "validator.swagger.io", "*"],
                fontSrc: ["'self'", "https:", "data:"],
                childSrc: ["'self'", "blob:"],
                styleSrcAttr: ["'self'", "'unsafe-inline'", "http:"],
                frameSrc: ["'self'"],
            },
        },
        dnsPrefetchControl: { allow: false },
        frameguard: { action: "deny" },
        hidePoweredBy: true,
        ieNoOpen: true,
        noSniff: true,
        permittedCrossDomainPolicies: { permittedPolicies: "none" },
        referrerPolicy: { policy: "no-referrer" },
        xssFilter: true,
        crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
        crossOriginResourcePolicy: { policy: "same-site" },
        originAgentCluster: true,
    }));
    app.use((req, res, next) => {
        res.setHeader("Permissions-Policy", 'fullscreen=(self), camera=(), geolocation=(self "https://*example.com"), autoplay=(), payment=(), microphone=()');
        next();
    });
    app.use((0, hpp_1.default)());
    app.useGlobalPipes(new common_1.ValidationPipe({ transform: true, stopAtFirstError: true }));
    app.useGlobalInterceptors(new common_1.ClassSerializerInterceptor(app.get(core_1.Reflector)));
    if (!["prod", "production"].includes(configService.get("STAGE").toLowerCase())) {
    }
    const port = configService.get("PORT") || process.env.PORT || 3000;
    const host = "0.0.0.0";
    console.log("[BOOT] Step 10: app.init() — port:", port);
    await app.init();
    console.log("[BOOT] Step 11: app.init() complete, setting up content-type parser");
    const fastifyInstance = app.getHttpAdapter().getInstance();
    fastifyInstance.removeContentTypeParser("application/json");
    fastifyInstance.addContentTypeParser("application/json", { parseAs: "buffer" }, function (req, body, done) {
        if (req.url?.includes("/webhook/stripe")) {
            done(null, body);
        }
        else {
            try {
                done(null, JSON.parse(body.toString("utf8")));
            }
            catch (err) {
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
//# sourceMappingURL=main.js.map