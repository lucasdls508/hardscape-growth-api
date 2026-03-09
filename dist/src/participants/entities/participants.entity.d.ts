import { Conversations } from "src/conversations/entities/conversations.entity";
import { User } from "src/user/entities/user.entity";
export declare class ConversationParticipant {
    id: number;
    user: User;
    conversation: Conversations;
    lead_phone?: string | null;
    lead_email?: string | null;
    isMuted: boolean;
    joined_at: Date;
}
