import { LeadSeedService } from "src/leads_info/lead_seed/lead_seed.service";
import { User } from "src/user/entities/user.entity";
import { AssignConstructorDto } from "./dtos/assign_contructor.dto";
import { LeadStatsQueryDto } from "./dtos/lead_stats.dto";
import { GetLeadsQueryDto } from "./dtos/leads_query.dto";
import { UpdateLeadDto } from "./dtos/LeadStatus.dto";
import { Lead } from "./entities/lead.entity";
import { LeadsInfoService } from "./leads_info.service";
import { LeadsQueryService } from "./leads_query/leads_query.service";
import { LeadsStatsService } from "./leads_stats/leads_stats.service";
export declare class LeadsController {
    private readonly leadsQueryService;
    private readonly leadsStatsService;
    private readonly leadsService;
    private readonly leadSeedService;
    constructor(leadsQueryService: LeadsQueryService, leadsStatsService: LeadsStatsService, leadsService: LeadsInfoService, leadSeedService: LeadSeedService);
    getUserLeads(user: User, query: GetLeadsQueryDto, userInfo: User): Promise<{
        data: Lead[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    GetLeadById(userInfo: User, id: string): Promise<{
        prepared_for: Lead;
        prepared_by: {
            id: string;
            buisness_profiles: import("../page_session/entites/meta_buisness.entity").MetaBuisnessProfiles;
            email: string;
            agency: import("../agency_profiles/entities/agency_profiles.entity").AgencyProfile[];
        };
    }>;
    updateLead(user: User, id: string, updateLeadDto: UpdateLeadDto): Promise<{
        message: string;
        data: Lead;
    }>;
    getLeadStats(user: User, query: LeadStatsQueryDto, userInfo: User): Promise<any>;
    assignConstructor(leadId: string, dto: AssignConstructorDto): Promise<Lead>;
    reassignConstructor(leadId: string, dto: AssignConstructorDto): Promise<Lead>;
    unassignConstructor(leadId: string): Promise<Lead>;
    updateProjectDetails(leadId: string, projectDetails: string, userInfo: User): Promise<Lead>;
}
