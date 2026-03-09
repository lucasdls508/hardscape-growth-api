import { MessageAttachment } from "src/attachment/entiies/attachments.entity";
import { Conversations } from "src/conversations/entities/conversations.entity";
import { User } from "src/user/entities/user.entity";
export declare enum MessageDirection {
    OUTBOUND = "OUTBOUND",
    INBOUND = "INBOUND"
}
export declare class Messages {
    id: number;
    sender_id: string;
    direction: MessageDirection;
    sender_user: User;
    conversation_id: number;
    sender_phone?: string;
    msg?: string;
    type?: "text" | "offer" | "image" | "video";
    conversation: Conversations;
    attachments?: MessageAttachment[];
    isRead: boolean;
    created_at: Date;
    updated_at: Date;
}
