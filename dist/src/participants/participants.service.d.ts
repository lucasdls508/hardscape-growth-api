import { Conversations } from "src/conversations/entities/conversations.entity";
import { Lead } from "src/leads_info/entities/lead.entity";
import { User } from "src/user/entities/user.entity";
import { EntityManager, QueryRunner, Repository } from "typeorm";
import { ConversationParticipant } from "./entities/participants.entity";
export declare class ParticipantsService {
    private participantRepo;
    constructor(participantRepo: Repository<ConversationParticipant>);
    add(conversation: Conversations, user: User): Promise<ConversationParticipant>;
    createParticipantEntity(queryRunner: QueryRunner, conversation: Conversations, user: User, lead: Lead): Promise<ConversationParticipant>;
    addMultiple(conversation: Conversations, users: User[], manager?: EntityManager): Promise<void>;
    checkChatAlreadyExist(query: {
        conversation_id?: number;
        product_id?: number;
        user_ids?: string[];
    }): Promise<ConversationParticipant[]>;
    getParticipants(conversationId: number): Promise<ConversationParticipant[]>;
    checkEligablity({ conversation_id, user_id, }: {
        user_id: string;
        conversation_id: number;
    }): Promise<{
        sender: null | User;
        receiver: null | User;
        conversation: null | Conversations;
    }>;
    findMyFriends(userId: string): Promise<User[]>;
    muteParticipant(conversationId: number, userId: string): Promise<ConversationParticipant>;
}
