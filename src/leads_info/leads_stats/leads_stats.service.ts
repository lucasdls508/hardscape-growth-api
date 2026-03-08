import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AppointmentsService } from "src/appointments/appointments.service";
import { RedisService } from "src/redis/redis.service";
import { UserRoles } from "src/user/enums/role.enum";
import { Repository } from "typeorm";
import { Lead } from "../entities/lead.entity";

@Injectable()
export class LeadsStatsService {
  private readonly STATS_TTL = 300; // 5 minutes

  constructor(
    @InjectRepository(Lead)
    private readonly _leadRepo: Repository<Lead>,
    private readonly _redisService: RedisService,
    private readonly _appointmentsService: AppointmentsService
  ) {}

  /* ----------------------------------------
   * DATE RANGE RESOLVER
   * --------------------------------------*/
  private resolveDateRange(filter: { type: string; monthName?: string }) {
    const now = new Date();
    let start: Date;
    let end: Date = now;

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
  async totalAppointmentsForLead(query: { agency_owner_id?: string; contructor_id?: string }) {
    return await this._appointmentsService._appointmentRepository.count({ where: query });
  }
  /* ----------------------------------------
   * LEAD STATS (CACHED)
   * --------------------------------------*/
  async getLeadStatistics({
    userId,
    role,
    agency_id,
    filter,
  }: {
    userId: string;
    agency_id?: null | string;
    role?: UserRoles;
    filter: { type: string; monthName?: string };
  }) {
    const cacheKey = `lead:stats:${userId}:${role}:${filter.type}:${filter.monthName || "all"}`;

    const cached = await this._redisService.getCache(cacheKey);
    if (cached) return cached;

    const { start, end } = this.resolveDateRange(filter);

    const qb = this._leadRepo.createQueryBuilder("lead");

    qb.where(role === UserRoles.AGENCY_OWNER ? "lead.agency_id = :userId" : "lead.contructor_id = :userId", {
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
    const queryPass =
      role === UserRoles.AGENCY_OWNER ? { agency_owner_id: agency_id } : { contructor_id: userId };
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

  /* ----------------------------------------
   * CACHE INVALIDATION
   * --------------------------------------*/
  async invalidateStats(userId: string) {
    await this._redisService.deleteByPattern(`lead:stats:${userId}:*`);
  }
}
