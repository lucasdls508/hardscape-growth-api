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
var RedisService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisService = void 0;
const cache_manager_1 = require("@nestjs/cache-manager");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const redis_1 = require("redis");
const logger_decorator_1 = require("../shared/decorators/logger.decorator");
const winston_1 = require("winston");
let RedisService = RedisService_1 = class RedisService {
    constructor(_cacheManager, _logger, _configService) {
        this._cacheManager = _cacheManager;
        this._logger = _logger;
        this._configService = _configService;
        const redisUrl = this._configService.get("REDIS_URL");
        const redisIp = this._configService.get("REDIS_IP") || "localhost";
        const isTls = redisIp.includes(".upstash.io");
        this.client = redisUrl
            ? (0, redis_1.createClient)({ url: redisUrl })
            : (0, redis_1.createClient)({
                socket: {
                    host: redisIp,
                    port: this._configService.get("REDIS_PORT") || 6379,
                    tls: isTls,
                },
                password: this._configService.get("REDIS_PASSWORD"),
            });
    }
    async onModuleInit() {
        if (!this.client.isOpen) {
            this._logger.log("Redis connecting...", RedisService_1);
            await this.client.connect();
            this._logger.log("Redis connected successfully", RedisService_1);
        }
    }
    async setCache(key, value) {
        await this._cacheManager.set(key, value);
    }
    async set(key, value, ttl) {
        await this.client.hSet(key, "data", JSON.stringify(value));
        await this.client.expire(key, ttl);
    }
    async del(key) {
        await this.client.del(key);
    }
    async get(key) {
        return await this.client.hGet(key, "data").then((res) => (res ? JSON.parse(res) : null));
    }
    async setCacheWithTTL(key, value, ttlSeconds) {
        await this._cacheManager.set(key, value, ttlSeconds);
        this._logger.debug(`Cache set: ${key} (TTL ${ttlSeconds}s)`);
    }
    async getCache(key) {
        return (await this._cacheManager.get(key));
    }
    async delCache(key) {
        await this._cacheManager.del(key);
    }
    async exists(key) {
        return (await this.client.exists(key)) === 1;
    }
    async deleteByPattern(pattern) {
        let cursor = 0;
        do {
            const { cursor: nextCursor, keys } = await this.client.scan(cursor, {
                MATCH: pattern,
                COUNT: 100,
            });
            cursor = nextCursor;
            if (keys.length) {
                await this.client.del(keys);
                this._logger.debug(`Deleted keys: ${keys.join(", ")}`);
            }
        } while (cursor !== 0);
    }
    getClient() {
        return this.client;
    }
    async getHash(key) {
        return await this.client.hGetAll(key);
    }
    async setHash(key, value) {
        await this.client.hSet(key, value);
    }
    async deleteHash(key) {
        await this.client.del(key);
    }
    async getList(key) {
        return await this.client.lRange(key, 0, -1);
    }
    async pushToList(key, value) {
        await this.client.rPush(key, value);
    }
    async deleteList(key) {
        await this.client.del(key);
    }
    async getLoginAttempts(key) {
        const value = await this.client.get(key);
        return value ? Number(value) : 0;
    }
    async incrementLoginAttempts(key) {
        const count = await this.client.incr(key);
        if (count === 1) {
            await this.client.expire(key, 600);
        }
        return count;
    }
    async resetLoginAttempts(key) {
        await this.client.del(key);
    }
};
exports.RedisService = RedisService;
exports.RedisService = RedisService = RedisService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __param(1, (0, logger_decorator_1.InjectLogger)()),
    __metadata("design:paramtypes", [Object, winston_1.Logger,
        config_1.ConfigService])
], RedisService);
//# sourceMappingURL=redis.service.js.map