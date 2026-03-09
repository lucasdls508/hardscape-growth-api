import { Job } from "bull";
import { AgencyProfilesService } from "src/agency_profiles/agency_profiles.service";
import { RedisService } from "src/redis/redis.service";
import { UserService } from "src/user/user.service";
export declare class GlobalQueueProcessor {
    private readonly _redisService;
    private readonly _agencyService;
    private readonly _userService;
    constructor(_redisService: RedisService, _agencyService: AgencyProfilesService, _userService: UserService);
    GlobalQueue(job: Job): Promise<void>;
}
