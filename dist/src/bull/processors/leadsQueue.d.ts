import { Job } from "bull";
import { AgencyProfilesService } from "src/agency_profiles/agency_profiles.service";
import { AppointmentsService } from "src/appointments/appointments.service";
import { ChatbotService } from "src/chatbot/chatbot.service";
import { ConversationsService } from "src/conversations/conversations.service";
import { LangChainOpenAIService } from "src/lang-chain-open-ai/lang-chain-open-ai.service";
import { LeadsInfoService } from "src/leads_info/leads_info.service";
import { MessagesService } from "src/messages/messages.service";
import { NotificationsService } from "src/notifications/notifications.service";
import { PageSessionService } from "src/page_session/page_session.service";
import { Field, LeadProfile } from "src/page_session/types/leadgen.types";
import { RedisService } from "src/redis/redis.service";
import { TwilioMessagingService } from "src/twilio-messaging/twilio-messaging.service";
import { UserService } from "src/user/user.service";
export declare const LEAD_QUEUE_JOB = "leads";
export declare const APPOINTMENT_SENDING = "appointment_sending";
export declare class LeadsQueueProcessor {
    private readonly _redisService;
    private readonly _agencyService;
    private readonly _userService;
    private readonly _metaBuisnesService;
    private readonly _leadsService;
    private readonly _chatbotService;
    private readonly _conversationService;
    private readonly _messageService;
    private readonly _twilioMessagingService;
    private readonly _appointmentsService;
    private readonly _langChain;
    private readonly _notificationsService;
    constructor(_redisService: RedisService, _agencyService: AgencyProfilesService, _userService: UserService, _metaBuisnesService: PageSessionService, _leadsService: LeadsInfoService, _chatbotService: ChatbotService, _conversationService: ConversationsService, _messageService: MessagesService, _twilioMessagingService: TwilioMessagingService, _appointmentsService: AppointmentsService, _langChain: LangChainOpenAIService, _notificationsService: NotificationsService);
    seedLead(job: Job<{
        page_id: string;
        lead_id: string;
        form_id: string;
        destructedLeadsInfo: LeadProfile;
        field_data: Field[];
    }>): Promise<void>;
    handleSmsMessage(job: Job<{
        from: string;
        to: string;
        body: string;
    }>): Promise<void>;
    handleMessengerMessage(job: Job<{
        page_id: string;
        sender_psid: string;
        message_text: string;
        timestamp: number;
    }>): Promise<void>;
    appointmentNotification(job: Job<{
        appointmentId: number;
        agency_owner_id: string;
        constructor_id?: string;
        lead_id: string;
        lead_contact?: string;
        start_time: Date;
        end_time?: Date;
    }>): Promise<void>;
    handleLeadStatusUpdate(job: Job<{
        leadId: string;
    }>): Promise<void>;
    handleEstimateSending(job: Job): Promise<void>;
    handleAppointmentSender(job: Job): Promise<void>;
    private _tryBookAppointment;
}
