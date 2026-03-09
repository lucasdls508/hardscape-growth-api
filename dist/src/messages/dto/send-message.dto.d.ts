import { AttachmentDto } from "src/attachment/dto/attachments.dto";
import { User } from "src/user/entities/user.entity";
import { MessageDirection } from "../entities/messages.entity";
export declare class SendMessageDto {
    conversation_id: number;
    msg?: string;
    sender_phone?: string;
    sender_email?: string;
    direction?: MessageDirection;
    type?: "text" | "image" | "video" | "offer";
    attachments?: AttachmentDto[];
}
export declare class SendMessageTypes extends SendMessageDto {
    sender: User;
}
