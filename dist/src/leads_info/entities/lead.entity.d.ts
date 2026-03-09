import { Conversations } from "src/conversations/entities/conversations.entity";
import { Estimates } from "src/estimates/entities/estimates.entity";
import { User } from "src/user/entities/user.entity";
import { LeadStatus } from "../enums/lead_status.enum";
export declare class Lead {
    id: string;
    meta_lead_id: string;
    messenger_psid: string;
    agency_id: string;
    agency: User;
    contructor_id: string;
    contructor: User;
    conversation: Conversations;
    estimates: Estimates[];
    status: LeadStatus;
    name: string;
    email: string;
    phone: string;
    address: string;
    form_id: string;
    form_info: any;
    project_details: string;
    start_time_pref: string;
    is_used: boolean;
    created_at: Date;
    deleted_at: Date;
}
