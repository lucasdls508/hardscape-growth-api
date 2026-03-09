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
exports.ContructorsService = void 0;
const common_1 = require("@nestjs/common");
const agency_profiles_entity_1 = require("../../agency_profiles/entities/agency_profiles.entity");
const argon2_1 = require("../../utils/hashes/argon2");
const typeorm_1 = require("typeorm");
const verification_dto_1 = require("../dto/verification-dto");
const user_entity_1 = require("../entities/user.entity");
const role_enum_1 = require("../enums/role.enum");
let ContructorsService = class ContructorsService {
    constructor(_dataSource) {
        this._dataSource = _dataSource;
    }
    async createMember(createMemberDto, agencyId) {
        const queryRunner = this._dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const { password, email, ...rest } = createMemberDto;
            const agency = await queryRunner.manager.findOne(agency_profiles_entity_1.AgencyProfile, {
                where: { id: agencyId },
            });
            if (!agency)
                throw new common_1.NotFoundException("Agency profile not found");
            const hashedPassword = await (0, argon2_1.argon2hash)(password);
            const user = await queryRunner.manager
                .createQueryBuilder()
                .insert()
                .into(user_entity_1.User)
                .values({
                ...rest,
                email,
                password: hashedPassword,
                roles: [role_enum_1.UserRoles.CONTRUCTOR],
                works_for_agency: agency,
                is_active: true,
            })
                .returning("id, first_name, last_name, email, roles, status")
                .execute();
            const newUser = user.raw[0];
            await queryRunner.manager.insert("verifications", {
                user_id: newUser.id,
                status: verification_dto_1.AccountStatus.ACTIVE,
            });
            await queryRunner.commitTransaction();
            return {
                ok: true,
                message: "Member created successfully",
                data: newUser,
            };
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            if (err.code === "23505") {
                throw new common_1.ConflictException("Email already exists");
            }
            throw err;
        }
        finally {
            await queryRunner.release();
        }
    }
};
exports.ContructorsService = ContructorsService;
exports.ContructorsService = ContructorsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], ContructorsService);
//# sourceMappingURL=contructors.service.js.map