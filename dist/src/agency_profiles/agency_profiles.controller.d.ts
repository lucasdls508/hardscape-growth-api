import { User } from "src/user/entities/user.entity";
import { AgencyProfilesService } from "./agency_profiles.service";
import { UpdateAgencyProfileDto } from "./dtos/update_agency.dto";
import { AgencyProfile } from "./entities/agency_profiles.entity";
export declare class AgencyProfilesController {
    private readonly _agencyProfileService;
    constructor(_agencyProfileService: AgencyProfilesService);
    updateMyAgencyProfile(req: any, dto: UpdateAgencyProfileDto, user: User): Promise<{
        ok: boolean;
        message: string;
        data: AgencyProfile;
    }>;
    getAgencyMembers(user: User, query: {
        page: number;
        limit: number;
    }): Promise<any>;
    updateMyAgency(user: User, dto: UpdateAgencyProfileDto): Promise<{
        ok: boolean;
        message: string;
        data: AgencyProfile;
    }>;
}
