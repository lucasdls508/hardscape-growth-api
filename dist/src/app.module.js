"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const throttler_1 = require("@nestjs/throttler");
const nest_winston_1 = require("nest-winston");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth/auth.module");
const winston_config_1 = require("./configs/winston.config");
const postgresql_module_1 = require("./database/postgresql.module");
const health_module_1 = require("./health/health.module");
const mail_module_1 = require("./mail/mail.module");
const otp_module_1 = require("./otp/otp.module");
const s3_module_1 = require("./s3/s3.module");
const logger_middleware_1 = require("./shared/middlewares/logger.middleware");
const sse_module_1 = require("./sse/sse.module");
const user_module_1 = require("./user/user.module");
const env_validation_1 = require("./utils/env.validation");
const search_module_1 = require("./search/search.module");
const cache_manager_1 = require("@nestjs/cache-manager");
const redisStore = __importStar(require("cache-manager-ioredis"));
const redis_module_1 = require("./redis/redis.module");
const bull_1 = require("@nestjs/bull");
const pushNotificationQueue_1 = require("./bull/processors/pushNotificationQueue");
const firebase_module_1 = require("./firebase/firebase.module");
const gemini_module_1 = require("./gemini/gemini.module");
const agency_profiles_module_1 = require("./agency_profiles/agency_profiles.module");
const appointments_module_1 = require("./appointments/appointments.module");
const AuthenticationQueue_1 = require("./bull/processors/AuthenticationQueue");
const globalQueue_1 = require("./bull/processors/globalQueue");
const leadsQueue_1 = require("./bull/processors/leadsQueue");
const messageQueue_1 = require("./bull/processors/messageQueue");
const OtpQueue_1 = require("./bull/processors/OtpQueue");
const uploadQueue_1 = require("./bull/processors/uploadQueue");
const catalogs_module_1 = require("./catalogs/catalogs.module");
const chatbot_module_1 = require("./chatbot/chatbot.module");
const conversations_module_1 = require("./conversations/conversations.module");
const estimates_module_1 = require("./estimates/estimates.module");
const lang_chain_open_ai_module_1 = require("./lang-chain-open-ai/lang-chain-open-ai.module");
const leads_info_module_1 = require("./leads_info/leads_info.module");
const messages_module_1 = require("./messages/messages.module");
const notifications_module_1 = require("./notifications/notifications.module");
const page_session_module_1 = require("./page_session/page_session.module");
const seeder_service_1 = require("./seeder/seeder.service");
const settings_module_1 = require("./settings/settings.module");
const socket_module_1 = require("./socket/socket.module");
const twilio_messaging_module_1 = require("./twilio-messaging/twilio-messaging.module");
const contructors_module_1 = require("./user/contructors/contructors.module");
const webhook_module_1 = require("./webhook/webhook.module");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(logger_middleware_1.LoggerMiddleware).forRoutes("*");
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            cache_manager_1.CacheModule.register(process.env.REDIS_URL
                ? {
                    isGlobal: true,
                    store: redisStore,
                    url: process.env.REDIS_URL,
                    ttl: 600,
                    max: 100,
                }
                : {
                    isGlobal: true,
                    store: redisStore,
                    prefix: "",
                    host: process.env.REDIS_IP || "localhost",
                    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
                    password: process.env.REDIS_PASSWORD || undefined,
                    tls: process.env.REDIS_IP?.includes(".upstash.io") ? {} : undefined,
                    ttl: 600,
                    max: 100,
                }),
            bull_1.BullModule.forRoot(process.env.REDIS_URL
                ? { redis: process.env.REDIS_URL }
                : {
                    redis: {
                        host: process.env.REDIS_IP || "localhost",
                        port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
                        password: process.env.REDIS_PASSWORD || undefined,
                        tls: process.env.REDIS_IP?.includes(".upstash.io") ? {} : undefined,
                    },
                }),
            bull_1.BullModule.registerQueue({
                name: "myQueue",
            }),
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                validationSchema: env_validation_1.envSchema,
                validationOptions: {
                    allowUnknown: true,
                    abortEarly: true,
                },
            }),
            throttler_1.ThrottlerModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => [
                    {
                        ttl: +config.get("THROTTLE_TTL"),
                        limit: +config.get("THROTTLE_LIMIT"),
                    },
                ],
            }),
            nest_winston_1.WinstonModule.forRoot(winston_config_1.winstonLoggerConfig),
            redis_module_1.RedisModule,
            postgresql_module_1.PostgreSQLDatabaseModule,
            auth_module_1.AuthModule,
            mail_module_1.MailModule,
            user_module_1.UserModule,
            health_module_1.HealthModule,
            s3_module_1.S3Module,
            sse_module_1.SseModule,
            otp_module_1.OtpModule,
            search_module_1.SearchModule,
            firebase_module_1.FirebaseModule,
            webhook_module_1.WebhookModule,
            bull_1.BullModule,
            gemini_module_1.GeminiModule,
            settings_module_1.SettingsModule,
            socket_module_1.SocketModule,
            notifications_module_1.NotificationsModule,
            page_session_module_1.PageSessionModule,
            leads_info_module_1.LeadsInfoModule,
            agency_profiles_module_1.AgencyProfilesModule,
            contructors_module_1.ContructorsModule,
            lang_chain_open_ai_module_1.LangChainOpenAiModule,
            chatbot_module_1.ChatbotModule,
            conversations_module_1.ConversationsModule,
            messages_module_1.MessagesModule,
            appointments_module_1.AppointmentsModule,
            catalogs_module_1.CatalogsModule,
            estimates_module_1.EstimatesModule,
            twilio_messaging_module_1.TwilioMessagingModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
            pushNotificationQueue_1.PushNotificationProccessor,
            seeder_service_1.SeederService,
            OtpQueue_1.OtpQueueProcessor,
            AuthenticationQueue_1.AuthQueueProcessor,
            uploadQueue_1.UploadProcessor,
            globalQueue_1.GlobalQueueProcessor,
            leadsQueue_1.LeadsQueueProcessor,
            messageQueue_1.MessagesProcessor,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map