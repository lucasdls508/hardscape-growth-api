import { RedisService } from "src/redis/redis.service";
import { User } from "src/user/entities/user.entity";
import { UserService } from "src/user/user.service";
import { Repository } from "typeorm";
import { UpdateAgencyProfileDto } from "./dtos/update_agency.dto";
import { AgencyProfile } from "./entities/agency_profiles.entity";
export declare class AgencyProfilesService {
    private readonly _agencyProfileRepo;
    private readonly _redisService;
    private readonly _userService;
    private readonly MEMBERS_TTL;
    constructor(_agencyProfileRepo: Repository<AgencyProfile>, _redisService: RedisService, _userService: UserService);
    updateMyAgencyProfile(user: User, dto: UpdateAgencyProfileDto): Promise<{
        ok: boolean;
        message: string;
        data: AgencyProfile;
    }>;
    getAgencyByUserId(userId: string, relations?: string[]): Promise<AgencyProfile>;
    updatePictures(user: User, dto: any): Promise<{
        ok: boolean;
        message: string;
    }>;
    getAgencyMembers(agencyOwnerId: string, page?: number, limit?: number): Promise<any>;
    updateMyAgencyProfileInfo(user: User, dto: UpdateAgencyProfileDto): Promise<{
        ok: boolean;
        message: string;
        data: AgencyProfile;
    }>;
}
