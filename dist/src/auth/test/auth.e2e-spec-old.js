"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mailer_1 = require("@nestjs-modules/mailer");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const testing_1 = require("@nestjs/testing");
const supertest_1 = __importDefault(require("supertest"));
const typeorm_1 = require("typeorm");
const mocks_1 = require("../../../test/mocks");
const postgresql_module_1 = require("../../database/postgresql.module");
const auth_module_1 = require("../auth.module");
describe("AuthController (e2e)", () => {
    let app;
    let dataSource;
    beforeAll(async () => {
        const moduleFixture = await testing_1.Test.createTestingModule({
            imports: [auth_module_1.AuthModule, postgresql_module_1.PostgreSQLDatabaseModule],
        })
            .overrideProvider(config_1.ConfigService)
            .useValue(mocks_1.mockConfigService)
            .overrideProvider(mailer_1.MailerService)
            .useValue(mocks_1.mockMailerService)
            .compile();
        app = moduleFixture.createNestApplication();
        app.useGlobalInterceptors(new common_1.ClassSerializerInterceptor(app.get(core_1.Reflector)));
        app.useGlobalPipes(new common_1.ValidationPipe({ transform: true }));
        await app.init();
        dataSource = app.get(typeorm_1.DataSource);
    });
    beforeEach(async () => {
        const entities = dataSource.entityMetadatas;
        for (const entity of entities) {
            const repository = dataSource.getRepository(entity.name);
            await repository.clear();
        }
    });
    afterAll(async () => {
        await app.close();
    });
    describe("POST /auth/signup", () => {
        const badInput = [
            { last_name: "last name", email: "test@mail.com", password: "Password@123" },
            { first_name: "first_name", email: "test@mail.com", password: "Password@123" },
            { first_name: "first_name", last_name: "last name", password: "Password@123" },
            { first_name: "first_name", last_name: "last name", email: "test@mail.com" },
            { first_name: "first_name", last_name: "last name", email: "test@mail", password: "Password@123" },
            { first_name: "first_name", last_name: "last name", email: "test@mail.com", password: "1243" },
            { first_name: "first_name", last_name: "last name", email: "test@mail.com", password: "password" },
            { first_name: "first-name", last_name: "last name", email: "test@mail.com", password: "Password@123" },
            { first_name: "admin", last_name: "last name", email: "test@mail.com", password: "Password@123" },
        ];
        const successInput = {
            first_name: "first_name",
            last_name: "last name",
            email: "test@mail.com",
            password: "Password@123",
            phone: "+8801837352979",
        };
        it("[404 Not Found] check -- signup route exists", async () => {
            const res = await (0, supertest_1.default)(global.app.getHttpServer()).post("/auth/signup").send({});
            expect(res.status).not.toBe(404);
        });
        it("[400 Bad Request] check -- signup doesn't occur for bad input data", async () => {
            for (let i = 0; i < badInput.length; i++) {
                const res = await (0, supertest_1.default)(global.app.getHttpServer()).post("/auth/signup").send(badInput[i]);
                expect(res.status).toBe(400);
            }
        });
        it("[201 Created] check -- signup occurs for good input data", async () => {
            const res = await (0, supertest_1.default)(global.app.getHttpServer()).post("/auth/signup").send(successInput);
            expect(res.status).toBe(201);
        });
        it("[409 Conflict] check -- signup doesn't occur for duplicate email", async () => {
            await (0, supertest_1.default)(global.app.getHttpServer()).post("/auth/signup").send(successInput).expect(201);
            const res = await (0, supertest_1.default)(global.app.getHttpServer()).post("/auth/signup").send(successInput);
            expect(res.status).toBe(409);
        });
    });
});
//# sourceMappingURL=auth.e2e-spec-old.js.map