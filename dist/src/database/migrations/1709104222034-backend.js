"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Backend1709104222034 = void 0;
class Backend1709104222034 {
    constructor() {
        this.name = "Backend1709104222034";
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "middleName"
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "middleName" character varying(50) NOT NULL
        `);
    }
}
exports.Backend1709104222034 = Backend1709104222034;
//# sourceMappingURL=1709104222034-backend.js.map