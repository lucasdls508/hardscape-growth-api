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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgencyProfilesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const redis_service_1 = require("../redis/redis.service");
const user_service_1 = require("../user/user.service");
const typeorm_2 = require("typeorm");
const agency_profiles_entity_1 = require("./entities/agency_profiles.entity");
let AgencyProfilesService = class AgencyProfilesService {
    constructor(_agencyProfileRepo, _redisService, _userService) {
        this._agencyProfileRepo = _agencyProfileRepo;
        this._redisService = _redisService;
        this._userService = _userService;
        this.MEMBERS_TTL = 300;
    }
    async updateMyAgencyProfile(user, dto) {
        const obj = this._agencyProfileRepo.create({ ...dto, agency_owner_id: user.id, agency_owner: user });
        const data = await this._agencyProfileRepo.save(obj);
        return {
            ok: true,
            message: "Agency Information updated successfully",
            data,
        };
    }
    async getAgencyByUserId(userId, relations = ["agency_owner"]) {
        const client = this._redisService.getClient();
        const relationKey = relations.sort().join(",");
        const cacheKey = `agency:owner:${userId}:${relationKey}`;
        const cachedData = await client.get(cacheKey);
        if (cachedData) {
            return JSON.parse(cachedData);
        }
        const agency = await this._agencyProfileRepo.findOne({
            where: { agency_owner_id: userId },
            relations: relations,
        });
        if (!agency) {
            throw new common_1.NotFoundException("Agency profile not found");
        }
        await client.set(cacheKey, JSON.stringify(agency), { EX: 3600 });
        return agency;
    }
    async updatePictures(user, dto) {
        try {
            if (!user?.id) {
                throw new Error("User ID is missing");
            }
            delete dto.user_id;
            const result = await this._agencyProfileRepo.update({ agency_owner_id: user.id }, dto);
            if (result.affected === 0) {
                console.warn("No rows were updated. Check if the ID exists in the correct table.");
            }
            return { ok: true, message: "Updated successfully" };
        }
        catch (error) {
            console.error("Update failed:", error);
            throw error;
        }
    }
    async getAgencyMembers(agencyOwnerId, page = 1, limit = 10) {
        console.log(agencyOwnerId);
        const cacheKey = `agency:members:${agencyOwnerId}:${page}:${limit}`;
        const cached = await this._redisService.getCache(cacheKey);
        if (cached)
            return cached;
        const agency = await this._agencyProfileRepo.findOne({
            where: { agency_owner_id: agencyOwnerId },
            select: ["id"],
        });
        if (!agency) {
            throw new common_1.NotFoundException("Agency profile not found");
        }
        const [members, total] = await this._userService.findUsersByAgency(agency.id, page, limit);
        const result = {
            data: members,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
        await this._redisService.setCacheWithTTL(cacheKey, result, 300);
        return result;
    }
    async updateMyAgencyProfileInfo(user, dto) {
        const agency = await this._agencyProfileRepo.findOne({
            where: { agency_owner_id: user.id },
        });
        if (!agency) {
            throw new common_1.NotFoundException("Agency profile not found");
        }
        const allowedFields = [
            "agency_name",
            "description",
            "website",
            "contact_email",
            "facebook_page_link",
            "ein",
            "nid_no",
            "nid_front",
            "nid_back",
            "tax_no",
            "tax_id_front",
            "tax_id_back",
            "contact_phone",
            "logo",
            "address",
        ];
        for (const key of allowedFields) {
            if (dto[key] !== undefined) {
                agency[key] = dto[key];
            }
        }
        Object.assign(agency, dto);
        const updated = await this._agencyProfileRepo.save(agency);
        return {
            ok: true,
            message: "Agency Information updated successfully",
            data: updated,
        };
    }
};
exports.AgencyProfilesService = AgencyProfilesService;
exports.AgencyProfilesService = AgencyProfilesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(agency_profiles_entity_1.AgencyProfile)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        redis_service_1.RedisService,
        user_service_1.UserService])
], AgencyProfilesService);
//# sourceMappingURL=agency_profiles.service.js.map