import { Job } from "bull";
import { AgencyProfilesService } from "src/agency_profiles/agency_profiles.service";
import { RedisService } from "src/redis/redis.service";
import { UserService } from "src/user/user.service";
import { AgencyUpdateData } from "src/webhook/types/aws_webhook";
export declare class UploadProcessor {
    private readonly _redisService;
    private readonly _agencyService;
    private readonly _userService;
    constructor(_redisService: RedisService, _agencyService: AgencyProfilesService, _userService: UserService);
    handleFlush(job: Job<{
        pushData: AgencyUpdateData;
    }>): Promise<void>;
}
