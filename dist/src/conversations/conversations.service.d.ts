import { ResponseInterface } from "src/common/types/responseInterface";
import { Lead } from "src/leads_info/entities/lead.entity";
import { Messages } from "src/messages/entities/messages.entity";
import { ParticipantsService } from "src/participants/participants.service";
import { RedisService } from "src/redis/redis.service";
import { SocketService } from "src/socket/socket.service";
import { User } from "src/user/entities/user.entity";
import { UserService } from "src/user/user.service";
import { DataSource, QueryRunner, Repository } from "typeorm";
import { CreateDirectConversationDto } from "./dto/create-direct-conversation.dto";
import { Conversations } from "./entities/conversations.entity";
export declare class ConversationsService {
    private _conversationRepo;
    private _messageRepo;
    private readonly _participantService;
    private readonly _userService;
    private _dataSource;
    private readonly _socketService;
    private readonly _redisService;
    constructor(_conversationRepo: Repository<Conversations>, _messageRepo: Repository<Messages>, _participantService: ParticipantsService, _userService: UserService, _dataSource: DataSource, _socketService: SocketService, _redisService: RedisService);
    private readonly CONVERSATION_CACHE_TTL;
    CONVERSATION_CACHE_KEY: (id: number) => string;
    getConversationByLeadId(leadId: string): Promise<Conversations>;
    getConversationId(conversationId: number): Promise<Conversations>;
    getCachedConversation(conversationId: number): Promise<any>;
    createConversation({ lead, user }: {
        lead: Lead;
        user: User;
    }): Promise<Conversations>;
    createConversationEntity(lead: Lead, queryRunner: QueryRunner): Promise<Conversations>;
    updateLastMessage(conversation: Conversations, message: Messages): Promise<Conversations>;
    updatedConversation({ conversation_id, conversation, message, }: {
        conversation_id: number;
        conversation?: Partial<Conversations>;
        message: Messages;
    }): Promise<Conversations>;
    getAllConversations(user_id: string, term: string, page: number, limit: number): Promise<{
        message: string;
        statusCode: number;
        data: Conversations[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    directConversation({ dto, user, }: {
        dto: CreateDirectConversationDto;
        user: User;
    }): Promise<ResponseInterface<Conversations>>;
}
