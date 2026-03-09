import { Queue } from "bullmq";
import { AttachmentService } from "src/attachment/attachment.service";
import { ChatbotService } from "src/chatbot/chatbot.service";
import { ConversationsService } from "src/conversations/conversations.service";
import { MetaBuisnessProfiles } from "src/page_session/entites/meta_buisness.entity";
import { ConversationParticipant } from "src/participants/entities/participants.entity";
import { RedisService } from "src/redis/redis.service";
import { SocketService } from "src/socket/socket.service";
import { UserService } from "src/user/user.service";
import { Repository } from "typeorm";
import { Logger } from "winston";
import { SendMessageTypes } from "./dto/send-message.dto";
import { Messages } from "./entities/messages.entity";
export declare class MessagesService {
    private _messageRepo;
    private readonly _conversationService;
    private readonly _userService;
    private readonly _attachmentService;
    private readonly _socketService;
    private readonly _logger;
    private readonly _redisService;
    private readonly _messageQueue;
    private readonly _chatService;
    constructor(_messageRepo: Repository<Messages>, _conversationService: ConversationsService, _userService: UserService, _attachmentService: AttachmentService, _socketService: SocketService, _logger: Logger, _redisService: RedisService, _messageQueue: Queue, _chatService: ChatbotService);
    sendMessage(dto: SendMessageTypes): Promise<Messages>;
    getMessages({ conversationId, page, limit, }: {
        conversationId: number;
        page: number;
        limit: number;
    }): Promise<any>;
    sendMessageWithAI(dto: SendMessageTypes, userInfo: MetaBuisnessProfiles, chat: ConversationParticipant[]): Promise<{
        userMessage: Messages;
        aiMessage: Messages;
    }>;
    private invalidateMessageListCache;
}
