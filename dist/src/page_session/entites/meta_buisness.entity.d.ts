import { AgencyProfile } from "src/agency_profiles/entities/agency_profiles.entity";
import { User } from "src/user/entities/user.entity";
export declare class MetaBuisnessProfiles {
    id: number;
    page_id: string;
    buisness_name: string;
    buisness_category: string;
    access_token: string;
    agency_profile: AgencyProfile;
    users: User;
    created_at: Date;
    updated_at: Date;
    deletedAt: Date;
}
