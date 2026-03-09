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
exports.ConversationMemoryService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const redis_service_1 = require("../../redis/redis.service");
let ConversationMemoryService = class ConversationMemoryService {
    constructor(_configService, _redisService) {
        this._configService = _configService;
        this._redisService = _redisService;
    }
    async onModuleInit() {
        this.redis = await this._redisService.getClient();
    }
    serializeContext(context) {
        return JSON.stringify(context, (key, value) => {
            if (value instanceof Map)
                return Object.fromEntries(value);
            if (value instanceof Date)
                return value.toISOString();
            return value;
        });
    }
    deserializeContext(data) {
        const context = JSON.parse(data);
        context.collectedData = new Map(Object.entries(context.collectedData || {}));
        context.metadata.startedAt = new Date(context.metadata.startedAt);
        context.metadata.lastActivityAt = new Date(context.metadata.lastActivityAt);
        return context;
    }
    async saveMessage(clientId, message) {
        try {
            const key = `conversation:${clientId}`;
            const serialized = JSON.stringify(message, (key, value) => {
                if (value instanceof Date)
                    return value.toISOString();
                return value;
            });
            await this.redis.lPush(key, serialized);
            await this.redis.expire(key, 86400);
        }
        catch (error) {
            console.error("Error saving message:", error);
            throw error;
        }
    }
    async getConversationHistory(clientId, limit = 50) {
        try {
            const key = `conversation:${clientId}`;
            const messages = await this.redis.lrange(key, 0, limit - 1);
            return messages
                .map((msg) => {
                const parsed = JSON.parse(msg);
                parsed.timestamp = new Date(parsed.timestamp);
                return parsed;
            })
                .reverse();
        }
        catch (error) {
            console.error("Error retrieving history:", error);
            return [];
        }
    }
    async saveClientContext(clientId, context) {
        try {
            const key = `context:${clientId}`;
            const serialized = this.serializeContext(context);
            await this.redis.set(key, serialized);
            await this.redis.expire(key, 86400);
        }
        catch (error) {
            console.error("Error saving context:", error);
            throw error;
        }
    }
    async getClientContext(clientId) {
        try {
            const key = `context:${clientId}`;
            const data = await this.redis.get(key);
            console.log("data", data);
            if (!data)
                return null;
            return this.deserializeContext(data);
        }
        catch (error) {
            console.error("Error retrieving context:", error);
            return null;
        }
    }
    async clearConversation(clientId) {
        try {
            await this.redis.del(`conversation:${clientId}`, `context:${clientId}`);
        }
        catch (error) {
            console.error("Error clearing conversation:", error);
            throw error;
        }
    }
    async getAllClientSessions() {
        try {
            const keys = await this.redis.keys("context:*");
            return keys.map((k) => k.replace("context:", ""));
        }
        catch (error) {
            console.error("Error getting sessions:", error);
            return [];
        }
    }
    async closeConnection() {
        await this.redis.quit();
    }
};
exports.ConversationMemoryService = ConversationMemoryService;
exports.ConversationMemoryService = ConversationMemoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        redis_service_1.RedisService])
], ConversationMemoryService);
//# sourceMappingURL=chat-conversation.service.js.map