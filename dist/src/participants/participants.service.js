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
exports.ParticipantsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const participants_entity_1 = require("./entities/participants.entity");
let ParticipantsService = class ParticipantsService {
    constructor(participantRepo) {
        this.participantRepo = participantRepo;
    }
    async add(conversation, user) {
        const exists = await this.participantRepo.findOne({
            where: { conversation: { id: conversation.id }, user: { id: user.id } },
        });
        if (exists)
            return exists;
        const participant = this.participantRepo.create({ conversation, user });
        return this.participantRepo.save(participant);
    }
    async createParticipantEntity(queryRunner, conversation, user, lead) {
        const participantRepo = queryRunner.manager.getRepository(participants_entity_1.ConversationParticipant);
        const participant = participantRepo.create({
            conversation: conversation,
            user: user,
            lead_phone: lead.phone ?? null,
            lead_email: lead.email ?? null,
            isMuted: false,
        });
        console.log(participant);
        return await queryRunner.manager.save(participant);
    }
    async addMultiple(conversation, users, manager) {
        const participants = users.map((user) => ({
            user,
            conversation,
        }));
        if (manager) {
            await manager.getRepository(participants_entity_1.ConversationParticipant).save(participants);
        }
        else {
            await this.participantRepo.save(participants);
        }
    }
    async checkChatAlreadyExist(query) {
        const { conversation_id, product_id } = query;
        const whereConditions = {};
        if (product_id) {
            whereConditions.product = { id: product_id };
        }
        if (conversation_id) {
            whereConditions.conversation = { id: conversation_id };
        }
        const existingParticipants = await this.participantRepo.find({
            where: whereConditions,
            relations: ["user", "conversation", "product"],
        });
        return existingParticipants;
    }
    async getParticipants(conversationId) {
        return await this.participantRepo.find({
            where: { conversation: { id: conversationId } },
            relations: [
                "user",
                "user.buisness_profiles",
                "conversation",
            ],
        });
    }
    async checkEligablity({ conversation_id, user_id, }) {
        const participants = await this.getParticipants(conversation_id);
        let sender = null;
        let receiver = null;
        let eligable = null;
        let conversation = null;
        for (const participant of participants) {
            if (participant.user.id === user_id) {
                eligable = true;
                sender = participant.user;
            }
            else {
                receiver = participant.user;
            }
            conversation = participant.conversation;
        }
        if (!eligable) {
            return { sender: null, receiver: null, conversation: null };
        }
        return { sender, receiver, conversation };
    }
    async findMyFriends(userId) {
        const conversations = await this.participantRepo
            .createQueryBuilder("participant")
            .leftJoinAndSelect("participant.conversation", "conversation")
            .where("participant.user_id = :userId", { userId })
            .getMany();
        if (!conversations || conversations.length === 0) {
            return [];
        }
        const userIdsInSameConversations = conversations.map((participant) => participant.conversation.id);
        const participantsInSameConversations = await this.participantRepo
            .createQueryBuilder("participant")
            .leftJoinAndSelect("participant.user", "user")
            .addSelect(["user.email", "user.first_name", "user.last_name", "user.id"])
            .where("participant.conversation_id IN (:...conversationIds)", {
            conversationIds: userIdsInSameConversations,
        })
            .andWhere("participant.user_id != :userId", { userId })
            .getMany();
        const friends = participantsInSameConversations.map((participant) => participant.user);
        return friends;
    }
    async muteParticipant(conversationId, userId) {
        const participant = await this.participantRepo.findOneOrFail({
            where: { conversation: { id: conversationId }, user: { id: userId } },
        });
        participant.isMuted = true;
        return this.participantRepo.save(participant);
    }
};
exports.ParticipantsService = ParticipantsService;
exports.ParticipantsService = ParticipantsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(participants_entity_1.ConversationParticipant)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ParticipantsService);
//# sourceMappingURL=participants.service.js.map