import { AppointmentsService } from "src/appointments/appointments.service";
import { User } from "src/user/entities/user.entity";
import { Repository } from "typeorm";
import { UpdateLeadDto } from "./dtos/LeadStatus.dto";
import { Lead } from "./entities/lead.entity";
import { LeadSeedService } from "./lead_seed/lead_seed.service";
export declare class LeadsInfoService {
    private readonly _leadRepository;
    private readonly _appointmentsService;
    private readonly leadseedService;
    constructor(_leadRepository: Repository<Lead>, _appointmentsService: AppointmentsService, leadseedService: LeadSeedService);
    updateLeads(leadId: string): Promise<import("typeorm").UpdateResult>;
    updateLead(leadId: string, user: User, updateLeadDto: UpdateLeadDto): Promise<{
        message: string;
        data: Lead;
    }>;
    getLeadByPhone(phone_number: string): Promise<Lead>;
    getLeadByPsid(messenger_psid: string): Promise<Lead | null>;
    getLeadById(id: string, user: User): Promise<{
        prepared_for: Lead;
        prepared_by: {
            id: string;
            buisness_profiles: import("../page_session/entites/meta_buisness.entity").MetaBuisnessProfiles;
            email: string;
            agency: import("../agency_profiles/entities/agency_profiles.entity").AgencyProfile[];
        };
    }>;
    updateProjectDetails(leadId: string, projectDetails: string): Promise<Lead>;
    createLead({ page_id, meta_lead_id, form_id, user, contructor_id, ...otherFields }: {
        page_id: string;
        meta_lead_id: string;
        form_id: string;
        user: User;
        contructor_id?: string;
    } & Record<string, string>): Promise<Lead>;
    assignLeadToConstructor(leadId: string, contructorId: string): Promise<Lead>;
    assignConstructorToLead(leadId: string, constructorId: string): Promise<Lead>;
    reassignConstructor(leadId: string, constructorId: string): Promise<Lead>;
    unassignConstructor(leadId: string): Promise<Lead>;
    leedSeed(): Promise<void>;
}
