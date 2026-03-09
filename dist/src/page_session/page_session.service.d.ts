import { DataSource, Repository } from "typeorm";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { Queue } from "bull";
import { AgencyProfilesService } from "src/agency_profiles/agency_profiles.service";
import { RedisService } from "src/redis/redis.service";
import { UserService } from "src/user/user.service";
import { UpdateMetaBusinessProfileDto } from "./dto/update_meta_buisness_profile.dto";
import { MetaBuisnessProfiles } from "./entites/meta_buisness.entity";
import { FacebookPage } from "./types/buisness.types";
import { LeadgenLead } from "./types/leadgen.types";
import { PageDataMap } from "./types/page_info.types";
export declare class PageSessionService {
    private readonly _profileRepository;
    private readonly _configService;
    private readonly _httpService;
    private readonly _userService;
    private readonly _dataSource;
    private readonly _agencyProfileService;
    private readonly _redisService;
    private readonly _globalQueueService;
    private metaGraphApiUrl;
    private metaAccessToken;
    constructor(_profileRepository: Repository<MetaBuisnessProfiles>, _configService: ConfigService, _httpService: HttpService, _userService: UserService, _dataSource: DataSource, _agencyProfileService: AgencyProfilesService, _redisService: RedisService, _globalQueueService: Queue);
    getallBuisness(): Promise<{
        data: FacebookPage[];
    }>;
    getBuisness(): Promise<{
        data: FacebookPage[];
    }>;
    updateUserBuisnessProfile(): Promise<void>;
    findAll(): Promise<MetaBuisnessProfiles[]>;
    findOne(id: number): Promise<MetaBuisnessProfiles>;
    findByPageId(pageId: string): Promise<MetaBuisnessProfiles>;
    connectFacebookPage({ page_id, user_id }: {
        page_id: string;
        user_id: string;
    }): Promise<{
        ok: boolean;
        message: string;
        data: MetaBuisnessProfiles;
    }>;
    update(id: number, updateProfileDto: UpdateMetaBusinessProfileDto): Promise<MetaBuisnessProfiles>;
    remove(id: number): Promise<{
        message: string;
    }>;
    private fetchMetaBusinessData;
    syncWithMeta(): Promise<{
        message: string;
        data: FacebookPage[];
        ok: boolean;
    }>;
    validateMetaPageExists(page_id: string): Promise<{
        data: PageDataMap;
    }>;
    subscribeAppToPage(pageId: string, pageAccessToken: string): Promise<any>;
    sendMessengerReply({ recipient_psid, text, page_access_token, }: {
        recipient_psid: string;
        text: string;
        page_access_token: string;
    }): Promise<void>;
    leadInformations({ lead_id, access_token, }: {
        lead_id: string;
        access_token: string;
    }): Promise<{
        data: LeadgenLead;
    }>;
}
