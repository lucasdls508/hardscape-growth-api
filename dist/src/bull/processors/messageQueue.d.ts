import { WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { ConversationsService } from "src/conversations/conversations.service";
export declare const MESSAGE_QUEUE = "messages";
export declare const UPDATE_CONVERSATION_JOB = "update-conversation";
export declare const ADD_ATTACHMENTS_JOB = "add-attachments";
export declare class MessagesProcessor extends WorkerHost {
    private readonly _conversationService;
    constructor(_conversationService: ConversationsService);
    process(job: Job): Promise<void>;
}
