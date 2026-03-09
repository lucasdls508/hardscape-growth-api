import { AgencyProfile } from "src/agency_profiles/entities/agency_profiles.entity";
import { Estimates } from "src/estimates/entities/estimates.entity";
import { Lead } from "src/leads_info/entities/lead.entity";
import { MetaBuisnessProfiles } from "src/page_session/entites/meta_buisness.entity";
import { UserRoles } from "../enums/role.enum";
import { Verification } from "./verification.entity";
export declare enum USER_STATUS {
    VERIFIED = "verified",
    NOT_VERIFIED = "not_verified"
}
export declare class User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    image: string;
    status?: USER_STATUS;
    password: string;
    fcm: string;
    phone: string;
    current_refresh_token: string;
    roles: UserRoles[];
    is_active: boolean;
    buisness_profiles: MetaBuisnessProfiles;
    agency_profiles: AgencyProfile[];
    works_for_agency: AgencyProfile;
    leads: Lead[];
    estimates: Estimates[];
    verification: Verification;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
