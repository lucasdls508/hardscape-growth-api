import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { DataSource, DataSourceOptions } from "typeorm";
export declare function createOrmConfig(): DataSourceOptions & TypeOrmModuleOptions;
export declare function createDataSource(): DataSource;
export declare const dataSource: DataSource;
