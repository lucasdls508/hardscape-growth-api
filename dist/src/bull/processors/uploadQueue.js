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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const agency_profiles_service_1 = require("../../agency_profiles/agency_profiles.service");
const redis_service_1 = require("../../redis/redis.service");
const user_service_1 = require("../../user/user.service");
let UploadProcessor = class UploadProcessor {
    constructor(_redisService, _agencyService, _userService) {
        this._redisService = _redisService;
        this._agencyService = _agencyService;
        this._userService = _userService;
    }
    async handleFlush(job) {
        console.log("JOB", job.data);
        const { pushData } = job.data;
        const { user_id } = pushData;
        const client = this._redisService.getClient();
        const cacheKey = `s3_batch:${user_id}`;
        const data = (await client.hGetAll(cacheKey));
        if (!data || Object.keys(data).length === 0)
            return;
        if (pushData.user_id) {
            if (pushData.image) {
                await this._userService.updateImage({ imageUrl: pushData.image, user: { id: user_id } });
            }
            else {
                await this._agencyService.updatePictures({ id: user_id }, job.data.pushData);
            }
        }
        await client.del(cacheKey);
    }
};
exports.UploadProcessor = UploadProcessor;
__decorate([
    (0, bull_1.Process)("process-bulk"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UploadProcessor.prototype, "handleFlush", null);
exports.UploadProcessor = UploadProcessor = __decorate([
    (0, bull_1.Processor)("uploadQueue"),
    __metadata("design:paramtypes", [redis_service_1.RedisService,
        agency_profiles_service_1.AgencyProfilesService,
        user_service_1.UserService])
], UploadProcessor);
//# sourceMappingURL=uploadQueue.js.map