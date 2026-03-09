import { Messages } from "src/messages/entities/messages.entity";
export declare class MessageAttachment {
    id: number;
    message: Messages;
    file_url: string;
    file_type?: string;
    file_name?: string;
    uploaded_at: Date;
}
