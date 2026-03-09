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
exports.GlobalQueueProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const agency_profiles_service_1 = require("../../agency_profiles/agency_profiles.service");
const redis_service_1 = require("../../redis/redis.service");
const user_service_1 = require("../../user/user.service");
let GlobalQueueProcessor = class GlobalQueueProcessor {
    constructor(_redisService, _agencyService, _userService) {
        this._redisService = _redisService;
        this._agencyService = _agencyService;
        this._userService = _userService;
    }
    async GlobalQueue(job) {
        const { user_id } = job.data;
        const client = this._redisService.getClient();
        const keysToClear = await client.keys(`*:${user_id}:*`);
        if (keysToClear.length > 0) {
            await client.del(keysToClear);
        }
    }
};
exports.GlobalQueueProcessor = GlobalQueueProcessor;
__decorate([
    (0, bull_1.Process)("invalidate-user-cache"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GlobalQueueProcessor.prototype, "GlobalQueue", null);
exports.GlobalQueueProcessor = GlobalQueueProcessor = __decorate([
    (0, bull_1.Processor)("global"),
    __metadata("design:paramtypes", [redis_service_1.RedisService,
        agency_profiles_service_1.AgencyProfilesService,
        user_service_1.UserService])
], GlobalQueueProcessor);
//# sourceMappingURL=globalQueue.js.map