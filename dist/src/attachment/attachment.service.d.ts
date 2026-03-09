import { Messages } from "src/messages/entities/messages.entity";
import { Repository } from "typeorm";
import { MessageAttachment } from "./entiies/attachments.entity";
import { SendMessageDto } from "src/messages/dto/send-message.dto";
export declare class AttachmentService {
    private attachmentRepo;
    constructor(attachmentRepo: Repository<MessageAttachment>);
    addAttachments(message: Messages, attachments: SendMessageDto["attachments"]): Promise<MessageAttachment[]>;
    getAttachments(messageId: number): Promise<MessageAttachment[]>;
}
