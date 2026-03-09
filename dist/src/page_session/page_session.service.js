"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageSessionService = void 0;
const typeorm_1 = require("@nestjs/typeorm");
const rxjs_1 = require("rxjs");
const typeorm_2 = require("typeorm");
const axios_1 = require("@nestjs/axios");
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const agency_profiles_service_1 = require("../agency_profiles/agency_profiles.service");
const agency_profiles_entity_1 = require("../agency_profiles/entities/agency_profiles.entity");
const redis_service_1 = require("../redis/redis.service");
const user_entity_1 = require("../user/entities/user.entity");
const user_service_1 = require("../user/user.service");
const meta_buisness_entity_1 = require("./entites/meta_buisness.entity");
let PageSessionService = class PageSessionService {
    constructor(_profileRepository, _configService, _httpService, _userService, _dataSource, _agencyProfileService, _redisService, _globalQueueService) {
        this._profileRepository = _profileRepository;
        this._configService = _configService;
        this._httpService = _httpService;
        this._userService = _userService;
        this._dataSource = _dataSource;
        this._agencyProfileService = _agencyProfileService;
        this._redisService = _redisService;
        this._globalQueueService = _globalQueueService;
        this.metaGraphApiUrl = "https://graph.facebook.com/v24.0";
        this.metaAccessToken = this._configService.get("META_ACCESS_TOKEN");
        if (!this.metaAccessToken) {
            throw new Error("META_ACCESS_TOKEN is not configured");
        }
    }
    async getallBuisness() {
        try {
            const metaBusinessData = await this.fetchMetaBusinessData();
            return metaBusinessData;
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to create profile: ${error.message}`);
        }
    }
    async getBuisness() {
        try {
            const metaBusinessData = await this.fetchMetaBusinessData();
            return metaBusinessData;
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to create profile: ${error.message}`);
        }
    }
    async updateUserBuisnessProfile() {
        try {
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to update profile: ${error.message}`);
        }
    }
    async findAll() {
        try {
            return await this._profileRepository.find({
                order: {
                    created_at: "DESC",
                },
            });
        }
        catch (error) {
            throw new common_1.InternalServerErrorException("Failed to fetch profiles");
        }
    }
    async findOne(id) {
        try {
            const profile = await this._profileRepository.findOne({
                where: { id },
            });
            if (!profile) {
                throw new common_1.NotFoundException(`Profile with ID ${id} not found`);
            }
            return profile;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            throw new common_1.InternalServerErrorException("Failed to fetch profile");
        }
    }
    async findByPageId(pageId) {
        const client = this._redisService.getClient();
        const cacheKey = `meta_profile:page:${pageId}`;
        try {
            const cached = await client.get(cacheKey);
            if (cached) {
                return JSON.parse(cached);
            }
            const profile = await this._profileRepository.findOne({
                where: { page_id: pageId },
                relations: ["users"],
            });
            if (!profile) {
                throw new common_1.NotFoundException(`Profile with page ID ${pageId} not found`);
            }
            await client.set(cacheKey, JSON.stringify(profile), { EX: 600 });
            return profile;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            throw new common_1.InternalServerErrorException("Failed to fetch profile");
        }
    }
    async connectFacebookPage({ page_id, user_id }) {
        const queryRunner = this._dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const user = await queryRunner.manager.findOne(user_entity_1.User, {
                where: { id: user_id },
                relations: ["buisness_profiles"],
            });
            if (!user) {
                throw new common_1.NotFoundException(`User with ID ${user_id} not found`);
            }
            const metaData = await this.validateMetaPageExists(page_id);
            const pageInfo = metaData.data?.[page_id];
            if (!pageInfo) {
                throw new common_1.NotFoundException(`Meta page with ID ${page_id} not found in Meta response`);
            }
            const newProfile = queryRunner.manager.create(meta_buisness_entity_1.MetaBuisnessProfiles, {
                page_id: pageInfo.id,
                buisness_name: pageInfo.name,
                buisness_category: pageInfo.category || "Uncategorized",
                access_token: pageInfo.access_token || null,
                users: user,
            });
            const savedProfile = await queryRunner.manager.save(newProfile);
            await queryRunner.manager.update(agency_profiles_entity_1.AgencyProfile, { agency_owner_id: user.id }, { buisness_profile: savedProfile });
            user.buisness_profiles = savedProfile;
            await queryRunner.manager.save(user);
            await queryRunner.commitTransaction();
            await this._globalQueueService.add("invalidate-user-cache", { user_id: user.id });
            await this.subscribeAppToPage(page_id, pageInfo.access_token);
            return {
                ok: true,
                message: "Business configured successfully",
                data: savedProfile,
            };
        }
        catch (error) {
            console.log(error);
            await queryRunner.rollbackTransaction();
            throw new common_1.BadRequestException(`Failed to connect Facebook page: ${error.message}`);
        }
        finally {
            await queryRunner.release();
        }
    }
    async update(id, updateProfileDto) {
        try {
            const profile = await this.findOne(id);
            if (updateProfileDto.page_id && updateProfileDto.page_id !== profile.page_id) {
                await this.validateMetaPageExists(updateProfileDto.page_id);
            }
            Object.assign(profile, updateProfileDto);
            return await this._profileRepository.save(profile);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            throw new common_1.BadRequestException(`Failed to update profile: ${error.message}`);
        }
    }
    async remove(id) {
        try {
            const profile = await this.findOne(id);
            await this._profileRepository.remove(profile);
            return { message: `Profile with ID ${id} successfully deleted` };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            throw new common_1.InternalServerErrorException("Failed to delete profile");
        }
    }
    async fetchMetaBusinessData() {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this._httpService.get(`${this.metaGraphApiUrl}/me/accounts?limit=100&fields=link,name,access_token,category,category_list`, {
                params: {
                    access_token: this.metaAccessToken,
                },
            }));
            if (response.status === 400) {
                throw new Error("Meta API returned a bad request ! Renew access token");
            }
            return response.data;
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }
    async syncWithMeta() {
        try {
            const metaBusinessData = await this.fetchMetaBusinessData();
            if (!metaBusinessData || !metaBusinessData.data || metaBusinessData.data.length === 0) {
                throw new common_1.NotFoundException("No business data found from Meta");
            }
            return { message: "All pages retrived successfully", data: metaBusinessData.data, ok: true };
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to sync with Meta: ${error.message}`);
        }
    }
    async validateMetaPageExists(page_id) {
        try {
            return await (0, rxjs_1.firstValueFrom)(this._httpService.get(`${this.metaGraphApiUrl}?ids=${page_id}&fields=id,name,access_token,category`, {
                params: {
                    access_token: this.metaAccessToken,
                },
            }));
        }
        catch (error) {
            throw new common_1.BadRequestException(`Invalid Meta page ID: ${error.response?.data?.error?.message || "Page not found"}`);
        }
    }
    async subscribeAppToPage(pageId, pageAccessToken) {
        try {
            const subscribeResponse = await (0, rxjs_1.firstValueFrom)(this._httpService.post(`${this.metaGraphApiUrl}/${pageId}/subscribed_apps`, null, {
                params: {
                    access_token: pageAccessToken,
                    subscribed_fields: "leadgen,messages",
                },
            }));
            return {
                ok: true,
                data: { pageId, subscribed: subscribeResponse.data },
            };
        }
        catch (error) {
            console.log(error.response?.data?.error);
            throw new common_1.BadRequestException(`Meta subscription failed: ${error.response?.data?.error?.message || "Unknown error"}`);
        }
    }
    async sendMessengerReply({ recipient_psid, text, page_access_token, }) {
        await (0, rxjs_1.firstValueFrom)(this._httpService.post(`${this.metaGraphApiUrl}/me/messages`, {
            recipient: { id: recipient_psid },
            message: { text },
        }, { params: { access_token: page_access_token } }));
    }
    async leadInformations({ lead_id, access_token, }) {
        try {
            return await (0, rxjs_1.firstValueFrom)(this._httpService.get(`${this.metaGraphApiUrl}/${lead_id}`, {
                params: {
                    access_token: access_token,
                },
            }));
        }
        catch (error) {
            throw new common_1.BadRequestException(`Invalid Meta Lead ID: ${error.response?.data?.error?.message || "Page not found"}`);
        }
    }
};
exports.PageSessionService = PageSessionService;
exports.PageSessionService = PageSessionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(meta_buisness_entity_1.MetaBuisnessProfiles)),
    __param(7, (0, bull_1.InjectQueue)("global")),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        config_1.ConfigService,
        axios_1.HttpService,
        user_service_1.UserService,
        typeorm_2.DataSource,
        agency_profiles_service_1.AgencyProfilesService,
        redis_service_1.RedisService, Object])
], PageSessionService);
//# sourceMappingURL=page_session.service.js.map