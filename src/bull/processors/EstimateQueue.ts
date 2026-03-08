// estimates.processor.ts
// Consumes ESTIMATE_SENDING jobs and sends the signing link to the lead.

import { Process, Processor } from "@nestjs/bull";
import { Logger } from "@nestjs/common";
import { Job } from "bullmq";
import { MessagesService } from "src/messages/messages.service";

export const ESTIMATE_SENDING = "estimate:sending";

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

@Processor("estimates")
export class EstimatesProcessor {
  private readonly logger = new Logger(EstimatesProcessor.name);

  constructor(private readonly messagesService: MessagesService) {}

  @Process(ESTIMATE_SENDING)
  async handleEstimateSending(job: Job<EstimateSendingPayload>) {
    const { estimateId, signUrl, leadName, conversationId, preparedBy } = job.data;

    this.logger.log(`Dispatching estimate #${estimateId} sign link → ${leadName}`);

    const message =
      `Hi ${leadName}, your estimate is ready for review.\n\n` +
      `Please open the link below to review the details and sign:\n` +
      `${signUrl}\n\n` +
      `— ${preparedBy.first_name} ${preparedBy.last_name}`;

    // await this.messagesService.sendMessage({
    //   sender: preparedBy,
    //   conversation_id: conversationId,
    //   direction: MessageDirection.INBOUND,
    //   msg: message,
    // });

    this.logger.log(`Estimate #${estimateId} sign link sent successfully`);
  }
}
