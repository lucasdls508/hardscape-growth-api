import { AgencyProfile } from "src/agency_profiles/entities/agency_profiles.entity";
import { Lead } from "src/leads_info/entities/lead.entity";
export declare enum AppointmentStatus {
    SCHEDULED = "scheduled",
    COMPLETED = "completed",
    CANCELED = "canceled"
}
export declare class Appointment {
    id: number;
    agency_owner_id: string;
    constructor_id: string;
    lead_id: string;
    lead_contact: string;
    start_time: Date;
    end_time: Date;
    status: AppointmentStatus;
    agencyOwner: AgencyProfile;
    lead: Lead;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
