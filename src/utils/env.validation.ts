import * as Joi from "joi";

export const envSchema = Joi.object({
  NODE_ENV: Joi.string().required(),

  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DATABASE: Joi.string().required(),

  JWT_SECRET: Joi.string().required(),
  EXPIRES_IN: Joi.string().required(),

  EMAIL_USERNAME: Joi.string().required(),
  EMAIL_PASSWORD: Joi.string().required(),
  EMAIL_HOST: Joi.string().required(),
  EMAIL_PORT: Joi.number().required(),

  THROTTLE_TTL: Joi.number().required(),
  THROTTLE_LIMIT: Joi.number().required(),

  GOOGLE_CLIENT_ID: Joi.string().required(),
  GOOGLE_CLIENT_SECRET: Joi.string().required(),

  FR_BASE_URL: Joi.string().required(),

  HTTP_ENABLE: Joi.boolean().default(true).required(),
  HTTP_HOST: [Joi.string().ip({ version: "ipv4" }).required(), Joi.valid("localhost").required()],
  HTTP_PORT: Joi.number().default(3000).required(),
  HTTP_VERSIONING_ENABLE: Joi.boolean().default(true).required(),
  HTTP_VERSION: Joi.number().required(),

  DEBUGGER_HTTP_WRITE_INTO_FILE: Joi.boolean().default(false).required(),
  DEBUGGER_HTTP_WRITE_INTO_CONSOLE: Joi.boolean().default(false).required(),
  DEBUGGER_SYSTEM_WRITE_INTO_FILE: Joi.boolean().default(false).required(),
  DEBUGGER_SYSTEM_WRITE_INTO_CONSOLE: Joi.boolean().default(false).required(),

  JOB_ENABLE: Joi.boolean().default(false).required(),

  AUTH_JWT_ISSUER: Joi.string().required(),

  AUTH_JWT_ACCESS_TOKEN_SECRET_KEY: Joi.string().alphanum().min(5).max(50).required(),
  AUTH_JWT_ACCESS_TOKEN_EXPIRED: Joi.string().default("15m").required(),

  AUTH_JWT_REFRESH_TOKEN_SECRET_KEY: Joi.string().alphanum().min(5).max(50).required(),
  AUTH_JWT_REFRESH_TOKEN_EXPIRED: Joi.string().default("7d").required(),

  // AUTH_JWT_PAYLOAD_ENCRYPT: Joi.boolean().default(false).required(),
  // AUTH_JWT_PAYLOAD_ACCESS_TOKEN_ENCRYPT_KEY: Joi.string().allow(null, "").min(20).max(50).optional(),
  // AUTH_JWT_PAYLOAD_ACCESS_TOKEN_ENCRYPT_IV: Joi.string().allow(null, "").min(16).max(50).optional(),
  // AUTH_JWT_PAYLOAD_REFRESH_TOKEN_ENCRYPT_KEY: Joi.string().allow(null, "").min(20).max(50).optional(),
  // AUTH_JWT_PAYLOAD_REFRESH_TOKEN_ENCRYPT_IV: Joi.string().allow(null, "").min(16).max(50).optional(),
  REDIS_IP: [Joi.string().ip({ version: "ipv4" }).required(), Joi.valid("localhost").required()],
  REDIS_PORT: Joi.number().default(3000).required(),

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
