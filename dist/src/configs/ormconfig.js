"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataSource = void 0;
exports.createOrmConfig = createOrmConfig;
exports.createDataSource = createDataSource;
const config_1 = require("@nestjs/config");
const dotenv_1 = require("dotenv");
const path_1 = require("path");
const typeorm_1 = require("typeorm");
(0, dotenv_1.config)({ path: (0, path_1.join)(__dirname, "..", "..", `.env.${process.env.STAGE}`) });
function createOrmConfig() {
    const configService = new config_1.ConfigService();
    const databaseUrl = process.env.DATABASE_URL;
    const isExternalDb = databaseUrl && !databaseUrl.includes(".internal");
    const ormconfig = databaseUrl
        ? {
            type: "postgres",
            url: databaseUrl,
            entities: [(0, path_1.join)(__dirname, "..", "**", "**", "*.entity{.ts,.js}")],
            synchronize: true,
            retryAttempts: 3,
            connectTimeoutMS: 15000,
            migrations: [(0, path_1.join)(__dirname, "..", "database", "migrations", "*{.ts,.js}")],
            migrationsTableName: "migrations",
            migrationsRun: true,
            maxQueryExecutionTime: 1000,
            logging: false,
            ssl: isExternalDb ? { rejectUnauthorized: false } : false,
        }
        : {
            type: "postgres",
            host: configService.get("DB_HOST"),
            port: +configService.get("DB_PORT"),
            username: configService.get("DB_USER"),
            password: configService.get("DB_PASSWORD"),
            database: configService.get("DATABASE"),
            entities: [(0, path_1.join)(__dirname, "..", "**", "**", "*.entity{.ts,.js}")],
            synchronize: true,
            retryAttempts: 3,
            connectTimeoutMS: 15000,
            migrations: [(0, path_1.join)(__dirname, "..", "database", "migrations", "*{.ts,.js}")],
            migrationsTableName: "migrations",
            migrationsRun: true,
            maxQueryExecutionTime: 1000,
            logging: false,
        };
    return ormconfig;
}
function createDataSource() {
    return new typeorm_1.DataSource(createOrmConfig());
}
exports.dataSource = createDataSource();
//# sourceMappingURL=ormconfig.js.map