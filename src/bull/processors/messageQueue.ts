// messages.processor.ts
import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { ConversationsService } from "src/conversations/conversations.service";

export const MESSAGE_QUEUE = "messages";
export const UPDATE_CONVERSATION_JOB = "update-conversation";
export const ADD_ATTACHMENTS_JOB = "add-attachments";
@Processor(MESSAGE_QUEUE)
export class MessagesProcessor extends WorkerHost {
  constructor(private readonly _conversationService: ConversationsService) {
    super();
  }

  async process(job: Job): Promise<void> {
    console.log(job);
    switch (job.name) {
      case UPDATE_CONVERSATION_JOB:
        console.log("Job", job.data);
        await this._conversationService.updatedConversation(job.data);
        break;

      case "add-attachments":
        // handle if you want attachment processing async too
        break;
    }
  }
}
