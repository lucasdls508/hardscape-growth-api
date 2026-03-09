import { User } from "src/user/entities/user.entity";
import { ConversationsService } from "./conversations.service";
export declare class ConversationsController {
    private readonly conversationService;
    constructor(conversationService: ConversationsService);
    getConversations(user: User, page?: number, limit?: number, term?: string): Promise<{
        message: string;
        statusCode: number;
        data: import("./entities/conversations.entity").Conversations[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
}
