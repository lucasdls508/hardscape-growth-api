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
exports.dataSource = void 0;
exports.createOrmConfig = createOrmConfig;
exports.createDataSource = createDataSource;
const config_1 = require("@nestjs/config");
const dotenv_1 = require("dotenv");
const path_1 = require("path");
const typeorm_1 = require("typeorm");
const redisStore = __importStar(require("cache-manager-ioredis"));
(0, dotenv_1.config)({ path: (0, path_1.join)(__dirname, "..", "..", `.env.${process.env.STAGE}`) });
function createOrmConfig() {
    const configService = new config_1.ConfigService();
    const ormconfig = {
        type: "postgres",
        host: configService.get("DB_HOST"),
        port: +configService.get("DB_PORT"),
        username: configService.get("DB_USER"),
        password: configService.get("DB_PASSWORD"),
        database: configService.get("DATABASE"),
        entities: [(0, path_1.join)(__dirname, "..", "**", "**", "*.entity{.ts,.js}")],
        synchronize: true,
        retryAttempts: 1,
        connectTimeoutMS: 10000,
        migrations: [(0, path_1.join)(__dirname, "..", "database", "migrations", "*{.ts,.js}")],
        migrationsTableName: "migrations",
        migrationsRun: true,
        maxQueryExecutionTime: 1000,
        logging: true,
        logger: "file",
        cache: {
            type: redisStore,
            options: {
                socket: {
                    host: configService.get("REDIS_IP"),
                    port: configService.get("REDIS_PORT"),
                },
            },
        },
    };
    return ormconfig;
}
function createDataSource() {
    return new typeorm_1.DataSource(createOrmConfig());
}
exports.dataSource = createDataSource();
//# sourceMappingURL=ormconfig.js.map