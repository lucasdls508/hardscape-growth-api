import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { config } from "dotenv";
import { join } from "path";
import { DataSource, DataSourceOptions } from "typeorm";

// FIXME: For AWS Secretmanager create a script to fetch the envs first to have migration capabilities
config({ path: join(__dirname, "..", "..", `.env.${process.env.STAGE}`) });

export function createOrmConfig(): DataSourceOptions & TypeOrmModuleOptions {
  const configService = new ConfigService();

  const databaseUrl = process.env.DATABASE_URL;

  // Render internal DB URLs use .internal hostname (no SSL). External URLs need SSL.
  const isExternalDb = databaseUrl && !databaseUrl.includes(".internal");

  const ormconfig: DataSourceOptions & TypeOrmModuleOptions = databaseUrl
    ? {
        type: "postgres",
        url: databaseUrl,
        entities: [join(__dirname, "..", "**", "**", "*.entity{.ts,.js}")],
        synchronize: true,
        retryAttempts: 3,
        connectTimeoutMS: 15000,
        migrations: [join(__dirname, "..", "database", "migrations", "*{.ts,.js}")],
        migrationsTableName: "migrations",
        migrationsRun: true,
        maxQueryExecutionTime: 1000,
        logging: false,
        ssl: isExternalDb ? { rejectUnauthorized: false } : false,
      }
    : {
        type: "postgres",
        host: configService.get<string>("DB_HOST"),
        port: +configService.get<string>("DB_PORT"),
        username: configService.get<string>("DB_USER"),
        password: configService.get<string>("DB_PASSWORD"),
        database: configService.get<string>("DATABASE"),
        entities: [join(__dirname, "..", "**", "**", "*.entity{.ts,.js}")],
        synchronize: true,
        retryAttempts: 3,
        connectTimeoutMS: 15000,
        migrations: [join(__dirname, "..", "database", "migrations", "*{.ts,.js}")],
        migrationsTableName: "migrations",
        migrationsRun: true,
        maxQueryExecutionTime: 1000,
        logging: false,
      };

  return ormconfig;
}

export function createDataSource() {
  return new DataSource(createOrmConfig());
}

// For Migrations
export const dataSource = createDataSource();
