import { Job } from "bullmq";
import { MessagesService } from "src/messages/messages.service";
export declare const ESTIMATE_SENDING = "estimate:sending";
interface EstimateSendingPayload {
    estimateId: number;
    signUrl: string;
    leadId: string;
    leadName: string;
    leadPhone: string;
    leadEmail: string;
    conversationId: string;
    preparedBy: {
        id: string;
        first_name: string;
        last_name: string;
    };
}
export declare class EstimatesProcessor {
    private readonly messagesService;
    private readonly logger;
    constructor(messagesService: MessagesService);
    handleEstimateSending(job: Job<EstimateSendingPayload>): Promise<void>;
}
export {};
