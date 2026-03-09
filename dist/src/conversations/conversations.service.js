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
exports.ConversationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const messages_entity_1 = require("../messages/entities/messages.entity");
const participants_entity_1 = require("../participants/entities/participants.entity");
const participants_service_1 = require("../participants/participants.service");
const redis_service_1 = require("../redis/redis.service");
const pagination_1 = require("../shared/utils/pagination");
const socket_service_1 = require("../socket/socket.service");
const user_entity_1 = require("../user/entities/user.entity");
const user_service_1 = require("../user/user.service");
const typeorm_2 = require("typeorm");
const conversations_entity_1 = require("./entities/conversations.entity");
let ConversationsService = class ConversationsService {
    constructor(_conversationRepo, _messageRepo, _participantService, _userService, _dataSource, _socketService, _redisService) {
        this._conversationRepo = _conversationRepo;
        this._messageRepo = _messageRepo;
        this._participantService = _participantService;
        this._userService = _userService;
        this._dataSource = _dataSource;
        this._socketService = _socketService;
        this._redisService = _redisService;
        this.CONVERSATION_CACHE_TTL = 300;
        this.CONVERSATION_CACHE_KEY = (id) => `conversation:${id}`;
    }
    async getConversationByLeadId(leadId) {
        return await this._conversationRepo.findOne({ where: { lead: { id: leadId } } });
    }
    async getConversationId(conversationId) {
        return await this._conversationRepo
            .createQueryBuilder("conversation")
            .leftJoin("conversation.lead", "lead")
            .select([
            "conversation.id",
            "conversation.lead_phone",
            "conversation.lead_email",
            "lead.id",
        ])
            .where("conversation.id = :conversationId", { conversationId })
            .getOne();
    }
    async getCachedConversation(conversationId) {
        const cacheKey = this.CONVERSATION_CACHE_KEY(conversationId);
        const cached = await this._redisService.getCache(cacheKey);
        if (cached)
            return cached;
        const conversation = await this.getConversationId(conversationId);
        await this._redisService.setCacheWithTTL(cacheKey, conversation, this.CONVERSATION_CACHE_TTL);
        return conversation;
    }
    async createConversation({ lead, user }) {
        const queryRunner = this._dataSource.createQueryRunner();
        try {
            const conversationEntity = queryRunner.manager.create(conversations_entity_1.Conversations, {
                lead_phone: lead.phone ?? null,
                lead_email: lead.email ?? null,
                lead,
                user,
            });
            const savedConversation = await queryRunner.manager.save(conversationEntity);
            const participant = queryRunner.manager.create(participants_entity_1.ConversationParticipant, {
                conversation: savedConversation,
                lead: lead,
                user: user,
                lead_phone: lead.phone ?? null,
                lead_email: lead.email ?? null,
                isMuted: false,
            });
            await queryRunner.manager.save(participant);
            return savedConversation;
        }
        catch (error) {
            console.error("Transaction failed, rolling back:", error);
            throw error;
        }
        finally {
        }
    }
    async createConversationEntity(lead, queryRunner) {
        const conversation = queryRunner.manager.create(conversations_entity_1.Conversations, {
            lead_phone: lead.phone ?? null,
            lead_email: lead.email ?? null,
            lastmsg: null,
        });
        return queryRunner.manager.save(conversation);
    }
    async updateLastMessage(conversation, message) {
        conversation.lastmsg = message;
        return this._dataSource.manager.save(conversation);
    }
    async updatedConversation({ conversation_id, conversation, message, }) {
        const chat = await this.getConversationId(conversation_id);
        if (!chat) {
            throw new common_1.NotFoundException("Conversation not found");
        }
        if (message && conversation_id) {
            chat.lastmsg = message;
        }
        return await this._conversationRepo.save(chat);
    }
    async getAllConversations(user_id, term, page, limit) {
        try {
            const skip = (page - 1) * limit;
            const take = limit;
            const [conversations, total] = await this._conversationRepo
                .createQueryBuilder("conversation")
                .leftJoinAndSelect("conversation.participants", "participant")
                .leftJoinAndSelect("conversation.lastmsg", "lastmsg")
                .orderBy("conversation.created_at", "DESC")
                .where("participant.user_id = :user_id", { user_id })
                .andWhere(new typeorm_2.Brackets((qb) => {
                qb.where("conversation.lead_phone ILIKE :term", { term: `%${term}%` }).orWhere("conversation.lead_email ILIKE :term", { term: `%${term}%` });
            }))
                .skip(skip)
                .take(take)
                .cache(true)
                .getManyAndCount();
            const response = {
                message: "Conversations retrieved successfully",
                statusCode: 200,
                data: conversations,
                pagination: (0, pagination_1.pagination)({ page, limit, total }),
            };
            return response;
        }
        catch (error) {
            console.error("Error fetching conversations:", error);
            throw new common_1.BadRequestException("Unable to retrieve conversations at this time.");
        }
    }
    async directConversation({ dto, user, }) {
        const queryRunner = this._dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const { productId, userId } = dto;
            if (user.id === userId) {
                throw new common_1.ForbiddenException("same user can't create any conversation");
            }
            const participantIds = [userId, user.id];
            const existingConversations = await this._conversationRepo
                .createQueryBuilder("conversation")
                .leftJoinAndSelect("conversation.participants", "participants")
                .leftJoinAndSelect("participants.user", "user")
                .where("conversation.product = :productId", { productId })
                .getMany();
            for (const conv of existingConversations) {
                const participantUserIds = conv.participants.map((p) => p.user.id);
                if (participantUserIds.length === 2 &&
                    participantUserIds.includes(user.id) &&
                    participantUserIds.includes(userId)) {
                    return {
                        message: "conversation created successfully",
                        status: "success",
                        statusCode: 200,
                        data: await this._conversationRepo.findOne({
                            where: { id: conv.id },
                            relations: ["participants", "participants.user", "product"],
                        }),
                    };
                }
            }
            const users = await queryRunner.manager.find(user_entity_1.User, {
                where: { id: (0, typeorm_2.In)(participantIds) },
            });
            if (users.length !== participantIds.length) {
                throw new Error("One or more users not found");
            }
            const conversation = queryRunner.manager.create(conversations_entity_1.Conversations);
            const savedConversation = await queryRunner.manager.save(conversation);
            const participants = users.map((user) => queryRunner.manager.create(participants_entity_1.ConversationParticipant, {
                conversation: savedConversation,
                user,
            }));
            await queryRunner.manager.save(participants_entity_1.ConversationParticipant, participants);
            await queryRunner.commitTransaction();
            return {
                message: "conversation created successfully",
                status: "success",
                statusCode: 201,
                data: await this._conversationRepo.findOne({
                    where: { id: savedConversation.id },
                    relations: ["participants", "participants.user", "product"],
                }),
            };
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        }
        finally {
            await queryRunner.release();
        }
    }
};
exports.ConversationsService = ConversationsService;
exports.ConversationsService = ConversationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(conversations_entity_1.Conversations)),
    __param(1, (0, typeorm_1.InjectRepository)(messages_entity_1.Messages)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        participants_service_1.ParticipantsService,
        user_service_1.UserService,
        typeorm_2.DataSource,
        socket_service_1.SocketService,
        redis_service_1.RedisService])
], ConversationsService);
//# sourceMappingURL=conversations.service.js.map