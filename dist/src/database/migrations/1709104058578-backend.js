"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Backend1709104058578 = void 0;
class Backend1709104058578 {
    constructor() {
        this.name = "Backend1709104058578";
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "middleName" character varying(50) NOT NULL
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "middleName"
        `);
    }
}
exports.Backend1709104058578 = Backend1709104058578;
//# sourceMappingURL=1709104058578-backend.js.map