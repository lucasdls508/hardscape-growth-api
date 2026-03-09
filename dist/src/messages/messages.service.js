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
exports.MessagesService = void 0;
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const bullmq_1 = require("bullmq");
const attachment_service_1 = require("../attachment/attachment.service");
const messageQueue_1 = require("../bull/processors/messageQueue");
const chatbot_service_1 = require("../chatbot/chatbot.service");
const conversations_service_1 = require("../conversations/conversations.service");
const redis_service_1 = require("../redis/redis.service");
const logger_decorator_1 = require("../shared/decorators/logger.decorator");
const socket_service_1 = require("../socket/socket.service");
const user_service_1 = require("../user/user.service");
const typeorm_2 = require("typeorm");
const winston_1 = require("winston");
const messages_entity_1 = require("./entities/messages.entity");
let MessagesService = class MessagesService {
    constructor(_messageRepo, _conversationService, _userService, _attachmentService, _socketService, _logger, _redisService, _messageQueue, _chatService) {
        this._messageRepo = _messageRepo;
        this._conversationService = _conversationService;
        this._userService = _userService;
        this._attachmentService = _attachmentService;
        this._socketService = _socketService;
        this._logger = _logger;
        this._redisService = _redisService;
        this._messageQueue = _messageQueue;
        this._chatService = _chatService;
    }
    async sendMessage(dto) {
        try {
            const conversation = await this._conversationService.getCachedConversation(dto.conversation_id);
            console.log(conversation);
            console.log(dto);
            let message;
            if (dto.direction === messages_entity_1.MessageDirection.OUTBOUND) {
                message = this._messageRepo.create({
                    msg: dto.msg,
                    direction: dto.direction,
                    type: dto.type ? dto.type : "text",
                    sender_user: dto.sender,
                    sender_phone: dto.sender_phone,
                    conversation,
                    isRead: false,
                });
                console.log(message);
            }
            else {
                message = this._messageRepo.create({
                    msg: dto.msg,
                    direction: dto.direction,
                    type: dto.type ? dto.type : "text",
                    sender_user: dto.sender,
                    conversation,
                    isRead: false,
                });
            }
            this._logger.log("Message Service", message);
            const savedMessage = await this._messageRepo.save(message);
            await this._conversationService.updateLastMessage(conversation, savedMessage);
            await this._messageQueue.add(messageQueue_1.UPDATE_CONVERSATION_JOB, {
                conversation_id: conversation.id,
                message,
            }, {
                attempts: 3,
                backoff: { type: "exponential", delay: 1000 },
                removeOnComplete: true,
                removeOnFail: false,
            });
            await this._redisService.delCache(this._conversationService.CONVERSATION_CACHE_KEY(dto.conversation_id));
            return savedMessage;
        }
        catch (error) {
            this._logger.error("MessagesService.sendMessage failed", error);
            throw error;
        }
    }
    async getMessages({ conversationId, page, limit, }) {
        const cacheKey = `messages:${conversationId}:page:${page}:limit:${limit}`;
        const cached = await this._redisService.getCache(cacheKey);
        if (cached)
            return cached;
        const [messages, total] = await this._messageRepo.findAndCount({
            where: { conversation: { id: conversationId } },
            order: { created_at: "DESC" },
            skip: (page - 1) * limit,
            take: limit,
        });
        const conversation = await this._conversationService.getCachedConversation(conversationId);
        const result = {
            data: messages,
            conversation,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
        await this._redisService.setCacheWithTTL(cacheKey, result, 30);
        return result;
    }
    async sendMessageWithAI(dto, userInfo, chat) {
        try {
            const userMessage = await this.sendMessage(dto);
            console.log(userInfo);
            const aiResponse = await this._chatService.chatRaw(String(dto.conversation_id), dto.msg, userInfo);
            const aiMessageDto = {
                conversation_id: dto.conversation_id,
                msg: aiResponse.message,
                direction: messages_entity_1.MessageDirection.INBOUND,
                type: "text",
                sender: null,
            };
            const aiMessage = await this.sendMessage(aiMessageDto);
            if (aiResponse.nextAction === "complete") {
                await this._messageQueue.add("conversation-completed", {
                    conversation_id: dto.conversation_id,
                    collectedData: Object.fromEntries(aiResponse.collectedFields),
                }, {
                    attempts: 3,
                    backoff: { type: "exponential", delay: 1000 },
                    removeOnComplete: true,
                });
            }
            return { userMessage, aiMessage };
        }
        catch (error) {
            this._logger.error("MessagesService.sendMessageWithAI failed", { dto, error });
            throw error;
        }
    }
    async invalidateMessageListCache(conversationId) {
        await this._redisService.deleteByPattern(`messages:${conversationId}:*`);
    }
};
exports.MessagesService = MessagesService;
exports.MessagesService = MessagesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(messages_entity_1.Messages)),
    __param(5, (0, logger_decorator_1.InjectLogger)()),
    __param(7, (0, bull_1.InjectQueue)(messageQueue_1.MESSAGE_QUEUE)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        conversations_service_1.ConversationsService,
        user_service_1.UserService,
        attachment_service_1.AttachmentService,
        socket_service_1.SocketService,
        winston_1.Logger,
        redis_service_1.RedisService,
        bullmq_1.Queue,
        chatbot_service_1.ChatbotService])
], MessagesService);
//# sourceMappingURL=messages.service.js.map