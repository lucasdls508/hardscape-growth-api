import { DataSource } from "typeorm";
export declare function runMigrations(dataSource: DataSource, exitOnFailure?: boolean): Promise<void>;
