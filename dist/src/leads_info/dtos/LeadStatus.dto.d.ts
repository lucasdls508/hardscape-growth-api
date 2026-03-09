import { LeadStatus } from "../enums/lead_status.enum";
export declare class UpdateLeadDto {
    project_details?: string;
    status?: LeadStatus;
    is_used?: boolean;
}
