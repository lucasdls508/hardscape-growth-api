import { Lead } from "src/leads_info/entities/lead.entity";
import { Messages } from "src/messages/entities/messages.entity";
import { ConversationParticipant } from "src/participants/entities/participants.entity";
export declare class Conversations {
    id: number;
    lastmsg: Messages | null;
    messages: Messages[];
    participants: ConversationParticipant[];
    lead: Lead;
    lead_phone: string | null;
    lead_email: string | null;
    created_at: Date;
    updated_at: Date;
}
