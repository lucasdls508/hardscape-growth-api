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
exports.LeadsStatsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const appointments_service_1 = require("../../appointments/appointments.service");
const redis_service_1 = require("../../redis/redis.service");
const role_enum_1 = require("../../user/enums/role.enum");
const typeorm_2 = require("typeorm");
const lead_entity_1 = require("../entities/lead.entity");
let LeadsStatsService = class LeadsStatsService {
    constructor(_leadRepo, _redisService, _appointmentsService) {
        this._leadRepo = _leadRepo;
        this._redisService = _redisService;
        this._appointmentsService = _appointmentsService;
        this.STATS_TTL = 300;
    }
    resolveDateRange(filter) {
        const now = new Date();
        let start;
        let end = now;
        switch (filter.type) {
            case "last_week":
                start = new Date();
                start.setDate(now.getDate() - 7);
                break;
            case "last_month":
                start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                end = new Date(now.getFullYear(), now.getMonth(), 0);
                break;
            case "this_month":
                start = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            case "this_year":
                start = new Date(now.getFullYear(), 0, 1);
                break;
            case "previous_year":
                start = new Date(now.getFullYear() - 1, 0, 1);
                end = new Date(now.getFullYear() - 1, 11, 31);
                break;
            case "month":
                const monthIndex = new Date(`${filter.monthName} 1, 2020`).getMonth();
                start = new Date(now.getFullYear(), monthIndex, 1);
                end = new Date(now.getFullYear(), monthIndex + 1, 0);
                break;
            default:
                throw new Error("Invalid filter");
        }
        return { start, end };
    }
    async totalAppointmentsForLead(query) {
        return await this._appointmentsService._appointmentRepository.count({ where: query });
    }
    async getLeadStatistics({ userId, role, agency_id, filter, }) {
        const cacheKey = `lead:stats:${userId}:${role}:${filter.type}:${filter.monthName || "all"}`;
        const cached = await this._redisService.getCache(cacheKey);
        if (cached)
            return cached;
        const { start, end } = this.resolveDateRange(filter);
        const qb = this._leadRepo.createQueryBuilder("lead");
        qb.where(role === role_enum_1.UserRoles.AGENCY_OWNER ? "lead.agency_id = :userId" : "lead.contructor_id = :userId", {
            userId,
        })
            .andWhere("lead.created_at BETWEEN :start AND :end", { start, end })
            .andWhere("lead.deleted_at IS NULL");
        const total = await qb.getCount();
        const statusBreakdown = await qb
            .select("lead.status", "status")
            .addSelect("COUNT(*)", "count")
            .groupBy("lead.status")
            .getRawMany();
        const usageBreakdown = await qb
            .select("lead.is_used", "is_used")
            .addSelect("COUNT(*)", "count")
            .groupBy("lead.is_used")
            .getRawMany();
        const queryPass = role === role_enum_1.UserRoles.AGENCY_OWNER ? { agency_owner_id: agency_id } : { contructor_id: userId };
        const result = {
            range: { start, end },
            total,
            status_breakdown: statusBreakdown,
            usage_breakdown: usageBreakdown,
            appointments_count: await this.totalAppointmentsForLead(queryPass),
        };
        await this._redisService.setCacheWithTTL(cacheKey, result, this.STATS_TTL);
        return result;
    }
    async invalidateStats(userId) {
        await this._redisService.deleteByPattern(`lead:stats:${userId}:*`);
    }
};
exports.LeadsStatsService = LeadsStatsService;
exports.LeadsStatsService = LeadsStatsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(lead_entity_1.Lead)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        redis_service_1.RedisService,
        appointments_service_1.AppointmentsService])
], LeadsStatsService);
//# sourceMappingURL=leads_stats.service.js.map