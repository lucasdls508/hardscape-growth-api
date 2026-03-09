import { AppointmentsService } from "src/appointments/appointments.service";
import { RedisService } from "src/redis/redis.service";
import { UserRoles } from "src/user/enums/role.enum";
import { Repository } from "typeorm";
import { Lead } from "../entities/lead.entity";
export declare class LeadsStatsService {
    private readonly _leadRepo;
    private readonly _redisService;
    private readonly _appointmentsService;
    private readonly STATS_TTL;
    constructor(_leadRepo: Repository<Lead>, _redisService: RedisService, _appointmentsService: AppointmentsService);
    private resolveDateRange;
    totalAppointmentsForLead(query: {
        agency_owner_id?: string;
        contructor_id?: string;
    }): Promise<number>;
    getLeadStatistics({ userId, role, agency_id, filter, }: {
        userId: string;
        agency_id?: null | string;
        role?: UserRoles;
        filter: {
            type: string;
            monthName?: string;
        };
    }): Promise<any>;
    invalidateStats(userId: string): Promise<void>;
}
