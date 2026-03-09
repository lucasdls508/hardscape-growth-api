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
exports.LeadsQueryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const role_enum_1 = require("../../user/enums/role.enum");
const typeorm_2 = require("typeorm");
const lead_entity_1 = require("../entities/lead.entity");
let LeadsQueryService = class LeadsQueryService {
    constructor(leadRepo) {
        this.leadRepo = leadRepo;
    }
    async getUserLeads({ userId, role = ["agency_owner"], page = 1, limit = 10, status, is_used, }) {
        const qb = this.leadRepo.createQueryBuilder("lead");
        if (role.includes(role_enum_1.UserRoles.AGENCY_OWNER)) {
            qb.where("lead.agency_id = :userId", { userId });
        }
        else {
            qb.where("lead.contructor_id = :userId", { userId });
        }
        qb.andWhere("lead.deleted_at IS NULL");
        if (status) {
            qb.andWhere("lead.status = :status", { status });
        }
        if (typeof is_used === "boolean") {
            qb.andWhere("lead.is_used = :is_used", { is_used });
        }
        qb.leftJoinAndSelect("lead.conversation", "conversation");
        qb.select([
            "lead.id",
            "lead.name",
            "lead.email",
            "lead.phone",
            "lead.project_details",
            "lead.status",
            "lead.is_used",
            "lead.created_at",
            "conversation.id",
            "conversation.lead_phone",
            "conversation.created_at",
        ]);
        qb.orderBy("lead.created_at", "DESC")
            .skip((page - 1) * limit)
            .take(limit);
        const [data, total] = await qb.getManyAndCount();
        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
};
exports.LeadsQueryService = LeadsQueryService;
exports.LeadsQueryService = LeadsQueryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(lead_entity_1.Lead)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], LeadsQueryService);
//# sourceMappingURL=leads_query.service.js.map