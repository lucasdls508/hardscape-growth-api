"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeederService = void 0;
const common_1 = require("@nestjs/common");
const leads_info_service_1 = require("../leads_info/leads_info.service");
const settings_service_1 = require("../settings/settings.service");
const verification_dto_1 = require("../user/dto/verification-dto");
const role_enum_1 = require("../user/enums/role.enum");
const user_service_1 = require("../user/user.service");
const argon2_1 = require("../utils/hashes/argon2");
const typeorm_1 = require("typeorm");
let SeederService = class SeederService {
    constructor(_userService, _dataSource, _leadsInfo, settingService) {
        this._userService = _userService;
        this._dataSource = _dataSource;
        this._leadsInfo = _leadsInfo;
        this.settingService = settingService;
    }
    async seedAdminUser() {
        const adminEmail = "admin@petAttix.com";
        const adminPassword = "1qaAzxsw2@";
        const existingAdmin = await this._userService.getUserByEmail("admin@petAttix.com");
        if (!existingAdmin) {
            const adminDto = {
                first_name: "Mr.",
                last_name: "Admin",
                phone: "+8801837352979",
                email: adminEmail,
                password: adminPassword,
                roles: [role_enum_1.UserRoles.ADMIN],
            };
            await this._userService.createSuperAdmin(adminDto);
            console.log("Admin user created successfully!");
        }
        else {
            console.log("Admin user already exists.");
        }
    }
    async seedFakeUsers() {
        const queryRunner = this._dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        const TOTAL_USERS = 20;
        const SHARED_PASSWORD = "Password123!";
        try {
            const hashedPassword = await (0, argon2_1.argon2hash)(SHARED_PASSWORD);
            for (let i = 1; i <= TOTAL_USERS; i++) {
                const firstName = `Fake`;
                const lastName = `User${i}`;
                const email = `testuser${i}@harscrape.com`;
                const phone = `123456789${i.toString().padStart(2, "0")}`;
                const userResult = await queryRunner.manager
                    .createQueryBuilder()
                    .insert()
                    .into("users")
                    .values({
                    first_name: firstName,
                    last_name: lastName,
                    email: email,
                    phone: phone,
                    password: hashedPassword,
                    status: verification_dto_1.AccountStatus.INACTIVE,
                    roles: ["user"],
                })
                    .returning("id")
                    .execute();
                const userId = userResult.raw[0].id;
                await queryRunner.manager.insert("verifications", {
                    user_id: userId,
                    status: verification_dto_1.AccountStatus.INACTIVE,
                });
            }
            await queryRunner.commitTransaction();
            return { message: `${TOTAL_USERS} users created with password: ${SHARED_PASSWORD}` };
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        }
        finally {
            await queryRunner.release();
        }
    }
    async seedSettings() {
        const seedData = [
            {
                key: "privacy_policy",
                content: `
        **Privacy Policy**
        Effective Date: 12-28-2024
        Vibley ("we," "our," "us") is committed to protecting your privacy. ...
      `,
            },
            {
                key: "about_us",
                content: `
        **About Us**
        Welcome to Vibley!
        At Vibley, we are dedicated to providing a community-focused platform. ...
      `,
            },
            {
                key: "terms_and_condition",
                content: `
        **Terms and Conditions**
        Effective Date: 12-28-2024
        Welcome to Vibley! By using our services, you agree to comply with ...
      `,
            },
        ];
        for (const item of seedData) {
            await this.settingService.updateSetting(item.key, item.content);
        }
        console.log("✅ Settings seeded.");
    }
    async seedLeeds() {
        await this._leadsInfo.leedSeed();
    }
};
exports.SeederService = SeederService;
exports.SeederService = SeederService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        typeorm_1.DataSource,
        leads_info_service_1.LeadsInfoService,
        settings_service_1.SettingsService])
], SeederService);
//# sourceMappingURL=seeder.service.js.map