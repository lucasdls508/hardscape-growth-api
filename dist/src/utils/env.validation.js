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
exports.envSchema = void 0;
const Joi = __importStar(require("joi"));
exports.envSchema = Joi.object({
    NODE_ENV: Joi.string().required(),
    DB_HOST: Joi.string().allow(null, "").optional(),
    DB_PORT: Joi.number().optional(),
    DB_USER: Joi.string().allow(null, "").optional(),
    DB_PASSWORD: Joi.string().allow(null, "").optional(),
    DATABASE: Joi.string().allow(null, "").optional(),
    DATABASE_URL: Joi.string().allow(null, "").optional(),
    JWT_SECRET: Joi.string().required(),
    EXPIRES_IN: Joi.string().required(),
    EMAIL_USERNAME: Joi.string().allow(null, "").optional(),
    EMAIL_PASSWORD: Joi.string().allow(null, "").optional(),
    EMAIL_HOST: Joi.string().allow(null, "").optional(),
    EMAIL_PORT: Joi.number().optional(),
    THROTTLE_TTL: Joi.number().required(),
    THROTTLE_LIMIT: Joi.number().required(),
    GOOGLE_CLIENT_ID: Joi.string().allow(null, "").optional(),
    GOOGLE_CLIENT_SECRET: Joi.string().allow(null, "").optional(),
    FR_BASE_URL: Joi.string().required(),
    HTTP_ENABLE: Joi.boolean().default(true).required(),
    HTTP_HOST: Joi.string().default("0.0.0.0").optional(),
    HTTP_PORT: Joi.number().default(3000).required(),
    HTTP_VERSIONING_ENABLE: Joi.boolean().default(true).required(),
    HTTP_VERSION: Joi.number().required(),
    DEBUGGER_HTTP_WRITE_INTO_FILE: Joi.boolean().default(false).required(),
    DEBUGGER_HTTP_WRITE_INTO_CONSOLE: Joi.boolean().default(false).required(),
    DEBUGGER_SYSTEM_WRITE_INTO_FILE: Joi.boolean().default(false).required(),
    DEBUGGER_SYSTEM_WRITE_INTO_CONSOLE: Joi.boolean().default(false).required(),
    JOB_ENABLE: Joi.boolean().default(false).required(),
    AUTH_JWT_ISSUER: Joi.string().required(),
    AUTH_JWT_ACCESS_TOKEN_SECRET_KEY: Joi.string().min(5).required(),
    AUTH_JWT_ACCESS_TOKEN_EXPIRED: Joi.string().default("15m").required(),
    AUTH_JWT_REFRESH_TOKEN_SECRET_KEY: Joi.string().min(5).required(),
    AUTH_JWT_REFRESH_TOKEN_EXPIRED: Joi.string().default("7d").required(),
    REDIS_IP: Joi.string().allow(null, "").optional(),
    REDIS_PORT: Joi.number().default(6379).optional(),
    REDIS_PASSWORD: Joi.string().allow(null, "").optional(),
    REDIS_URL: Joi.string().allow(null, "").optional(),
    STRIPE_SECRET_KEY: Joi.string().allow(null, "").optional(),
    STRIPE_WEBHOOK_SECRET: Joi.string().allow(null, "").optional(),
    ANTHROPIC_API_KEY: Joi.string().min(20).required(),
    BUSINESS_CITY: Joi.string().allow(null, "").optional(),
    GEMINI_API_KEY: Joi.string().allow(null, "").optional(),
    AWS_ACCESS_KEY_ID: Joi.string().allow(null, "").optional(),
    AWS_SECRET_ACCESS_KEY: Joi.string().allow(null, "").optional(),
    AWS_REGION: Joi.string().allow(null, "").optional(),
    AWS_S3_BUCKET_NAME: Joi.string().allow(null, "").optional(),
    AWS_ENDPOINT: Joi.string().allow(null, "").optional(),
    FIREBASE_PROJECT_ID: Joi.string().allow(null, "").optional(),
    FIREBASE_PRIVATE_KEY_ID: Joi.string().allow(null, "").optional(),
    FIREBASE_PRIVATE_KEY: Joi.string().allow(null, "").optional(),
    FIREBASE_CLIENT_ID: Joi.string().allow(null, "").optional(),
    FIREBASE_CLIENT_EMAIL: Joi.string().allow(null, "").optional(),
    FIREBASE_AUTH_URI: Joi.string().allow(null, "").optional(),
    FIREBASE_TOKEN_URI: Joi.string().allow(null, "").optional(),
    FIREBASE_AUTH_PROVIDER_CERT_URL: Joi.string().allow(null, "").optional(),
    FIREBASE_CLIENT_CERT_URL: Joi.string().allow(null, "").optional(),
    FIREBASE_UNIVERSE_DOMAIN: Joi.string().allow(null, "").optional(),
    TWILIO_ACCOUNT_SID: Joi.string().allow(null, "").optional(),
    TWILIO_AUTH_TOKEN: Joi.string().allow(null, "").optional(),
    TWILIO_PHONE_NUMBER: Joi.string().allow(null, "").optional(),
    META_ACCESS_TOKEN: Joi.string().allow(null, "").optional(),
    ADMIN_EMAIL: Joi.string().allow(null, "").optional(),
    ADMIN_PASSWORD: Joi.string().allow(null, "").optional(),
    ADMIN_FIRST_NAME: Joi.string().allow(null, "").optional(),
    ADMIN_LAST_NAME: Joi.string().allow(null, "").optional(),
    KAFKA_CLIENT_ID: Joi.string().allow(null, "").default("KAFKA_ACK").optional(),
    KAFKA_ADMIN_CLIENT_ID: Joi.string().allow(null, "").default("KAFKA_ADMIN_ACK").optional(),
    KAFKA_BROKERS: Joi.string().allow(null, "").default("localhost:9092").optional(),
    KAFKA_CONSUMER_ENABLE: Joi.boolean().default(true).optional(),
    KAFKA_CONSUMER_GROUP: Joi.string().allow(null, "").default("nestjs.ack").optional(),
});
//# sourceMappingURL=env.validation.js.map