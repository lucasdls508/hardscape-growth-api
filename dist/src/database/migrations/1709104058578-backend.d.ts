import { MigrationInterface, QueryRunner } from "typeorm";
export declare class Backend1709104058578 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
