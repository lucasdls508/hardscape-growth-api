import { Repository } from "typeorm";
import { Lead } from "../entities/lead.entity";
export declare class LeadsQueryService {
    private readonly leadRepo;
    constructor(leadRepo: Repository<Lead>);
    getUserLeads({ userId, role, page, limit, status, is_used, }: {
        userId: string;
        role?: string[];
        page?: number;
        limit?: number;
        status?: string;
        is_used?: boolean;
    }): Promise<{
        data: Lead[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
}
