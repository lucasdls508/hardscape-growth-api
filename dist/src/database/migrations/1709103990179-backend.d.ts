import { MigrationInterface, QueryRunner } from "typeorm";
export declare class Backend1709103990179 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
