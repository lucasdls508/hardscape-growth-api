import { User } from "src/user/entities/user.entity";
import { SendMessageDto, SendMessageTypes } from "./dto/send-message.dto";
import { MessagesService } from "./messages.service";
export declare class MessagesController {
    private readonly _messagesService;
    constructor(_messagesService: MessagesService);
    getMessages(conversationId: number, page?: number, limit?: number): Promise<any>;
    sendMessage(conversation: any, conversationId: number, body: SendMessageTypes): Promise<{
        userMessage: import("./entities/messages.entity").Messages;
        aiMessage: import("./entities/messages.entity").Messages;
    }>;
    sendMessages(conversation: any, conversationId: number, body: SendMessageDto, user: User): Promise<import("./entities/messages.entity").Messages>;
}
