import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import { AgencyProfilesService } from "src/agency_profiles/agency_profiles.service";
import { AppointmentsService } from "src/appointments/appointments.service";
import { ChatbotService } from "src/chatbot/chatbot.service";
import { ConversationsService } from "src/conversations/conversations.service";
import { LangChainOpenAIService } from "src/lang-chain-open-ai/lang-chain-open-ai.service";
import { LeadsInfoService } from "src/leads_info/leads_info.service";
import { Lead } from "src/leads_info/entities/lead.entity";
import { MessageDirection } from "src/messages/entities/messages.entity";
import { MessagesService } from "src/messages/messages.service";
import {
  NotificationAction,
  NotificationRelated,
  NotificationType,
} from "src/notifications/entities/notifications.entity";
import { NotificationsService } from "src/notifications/notifications.service";
import { PageSessionService } from "src/page_session/page_session.service";
import { Field, LeadProfile } from "src/page_session/types/leadgen.types";
import { RedisService } from "src/redis/redis.service";
import { TwilioMessagingService } from "src/twilio-messaging/twilio-messaging.service";
import { User } from "src/user/entities/user.entity";
import { UserService } from "src/user/user.service";
import {
  APPOINTMENT_NOTIFICATION_JOB,
  ESTIMATE_SENDING,
  LEAD_STATUS_UPDATE_JOB,
} from "./../../appointments/enums/appointments.enum";
export const LEAD_QUEUE_JOB = "leads";
export const APPOINTMENT_SENDING = "appointment_sending";
@Processor(LEAD_QUEUE_JOB)
export class LeadsQueueProcessor {
  constructor(
    private readonly _redisService: RedisService,
    private readonly _agencyService: AgencyProfilesService,
    private readonly _userService: UserService,
    private readonly _metaBuisnesService: PageSessionService,
    private readonly _leadsService: LeadsInfoService,
    private readonly _chatbotService: ChatbotService,
    private readonly _conversationService: ConversationsService,
    private readonly _messageService: MessagesService,
    private readonly _twilioMessagingService: TwilioMessagingService,
    private readonly _appointmentsService: AppointmentsService,
    private readonly _langChain: LangChainOpenAIService,
    private readonly _notificationsService: NotificationsService
  ) {}
  @Process("seed")
  async seedLead(
    job: Job<{
      page_id: string;
      lead_id: string;
      form_id: string;
      destructedLeadsInfo: LeadProfile;
      field_data: Field[];
    }>
  ) {
    const { page_id, lead_id, form_id, field_data, destructedLeadsInfo } = job.data;
    const { name, email, phone } = destructedLeadsInfo;
    const pageInfo = await this._metaBuisnesService.findByPageId(page_id);
    const leadsField = JSON.stringify(field_data);
    const lead = await this._leadsService.createLead({
      page_id,
      meta_lead_id: lead_id,
      form_id,
      email,
      name,
      user: pageInfo.users[0],
      phone,
      form_info: leadsField,
    });
    const user = pageInfo.users[0];
    console.log("User", pageInfo);
    const conversations = await this._conversationService.createConversation({ lead, user });
    console.log("conversation", conversations);
    const result = await this._chatbotService.chatWithForm(
      lead.id,
      "Hey , I have provided my informations.If you need anything you can ask me .",
      field_data,
      pageInfo
    );
    await this._messageService.sendMessage({
      sender: user,
      conversation_id: conversations.id,
      direction: MessageDirection.INBOUND,
      msg: result.message,
    });

    // Notify contractor: new lead from form
    await this._notificationsService.createNotification({
      recepient_id: user.id,
      actor_id: user.id,
      related: NotificationRelated.LEAD,
      action: NotificationAction.CREATED,
      type: NotificationType.INFO,
      msg: `New lead arrived: ${name || "Unknown"} submitted a form.`,
      targetId: 0,
      isImportant: true,
    });
  }

  @Process("sms-message")
  async handleSmsMessage(job: Job<{ from: string; to: string; body: string }>) {
    const { from, body: messageText } = job.data;

    // 1. Find existing lead by phone
    const lead = await this._leadsService.getLeadByPhone(from);
    if (!lead) {
      console.warn(`[sms-message] No lead found for phone ${from} — dropping`);
      return;
    }

    // 2. Resolve user + business profile from the lead's agency_id
    const user = await this._userService.getMe(lead.agency_id);
    if (!user?.buisness_profiles) {
      console.warn(`[sms-message] No business profile for user ${lead.agency_id} — dropping`);
      return;
    }
    const pageInfo = user.buisness_profiles;

    // 3. Find or create conversation
    let conversation = await this._conversationService.getConversationByLeadId(lead.id).catch(() => null);
    if (!conversation) {
      conversation = await this._conversationService.createConversation({ lead, user });
    }

    // 4. Save lead's incoming SMS
    await this._messageService.sendMessage({
      sender: user,
      conversation_id: conversation.id,
      direction: MessageDirection.OUTBOUND,
      msg: messageText,
    });

    // 5. Generate Sophia response
    const result = await this._chatbotService.chatRaw(lead.id, messageText, pageInfo as any);

    // 6. Save Sophia's reply
    await this._messageService.sendMessage({
      sender: user,
      conversation_id: conversation.id,
      direction: MessageDirection.INBOUND,
      msg: result.message,
    });

    // 7. Deliver via SMS
    await this._twilioMessagingService.sendMessage({ to: from, body: result.message });

    // 8. Auto-book appointment if Sophia confirmed one
    await this._tryBookAppointment(result.message, lead, user);

    // 9. Notify contractor of incoming SMS
    await this._notificationsService.createNotification({
      recepient_id: user.id,
      actor_id: user.id,
      related: NotificationRelated.LEAD,
      action: NotificationAction.CREATED,
      type: NotificationType.INFO,
      msg: `New SMS from ${lead.name || from}: "${messageText.slice(0, 80)}"`,
      targetId: 0,
      isImportant: false,
    });
  }

  @Process("messenger-message")
  async handleMessengerMessage(
    job: Job<{
      page_id: string;
      sender_psid: string;
      message_text: string;
      timestamp: number;
    }>
  ) {
    const { page_id, sender_psid, message_text } = job.data;

    // 1. Find the page (has user, access_token, business name)
    const pageInfo = await this._metaBuisnesService.findByPageId(page_id);
    const user = pageInfo.users[0];

    // 2. Find existing lead by PSID or create a new one
    let lead = await this._leadsService.getLeadByPsid(sender_psid);
    if (!lead) {
      lead = await this._leadsService.createLead({
        page_id,
        meta_lead_id: null,
        form_id: null,
        user,
        messenger_psid: sender_psid,
        name: "Messenger Lead",
      });
    }

    // 3. Find existing conversation or create one
    let conversation = await this._conversationService.getConversationByLeadId(lead.id).catch(() => null);
    if (!conversation) {
      conversation = await this._conversationService.createConversation({ lead, user });
    }

    // 4. Save the lead's incoming message
    await this._messageService.sendMessage({
      sender: user,
      conversation_id: conversation.id,
      direction: MessageDirection.OUTBOUND,
      msg: message_text,
    });

    // 5. Run Sophia (raw conversation — no form fields for Messenger)
    const result = await this._chatbotService.chatRaw(lead.id, message_text, pageInfo);

    // 6. Save Sophia's reply
    await this._messageService.sendMessage({
      sender: user,
      conversation_id: conversation.id,
      direction: MessageDirection.INBOUND,
      msg: result.message,
    });

    // 7. Send reply back to Messenger
    if (pageInfo.access_token) {
      await this._metaBuisnesService.sendMessengerReply({
        recipient_psid: sender_psid,
        text: result.message,
        page_access_token: pageInfo.access_token,
      });
    } else {
      console.warn(`[messenger-message] No access_token for page ${page_id} — reply not sent to Messenger`);
    }

    // 8. Auto-book appointment if Sophia confirmed one
    await this._tryBookAppointment(result.message, lead, user);

    // 9. Notify contractor of incoming Messenger message
    await this._notificationsService.createNotification({
      recepient_id: user.id,
      actor_id: user.id,
      related: NotificationRelated.LEAD,
      action: NotificationAction.CREATED,
      type: NotificationType.INFO,
      msg: `New Messenger message from ${lead.name || sender_psid}: "${message_text.slice(0, 80)}"`,
      targetId: 0,
      isImportant: false,
    });
  }

  @Process(APPOINTMENT_NOTIFICATION_JOB)
  async appointmentNotification(
    job: Job<{
      appointmentId: number;
      agency_owner_id: string;
      constructor_id?: string;
      lead_id: string;
      lead_contact?: string;
      start_time: Date;
      end_time?: Date;
    }>
  ) {
    const { agency_owner_id, lead_contact, start_time, appointmentId } = job.data;

    await this._notificationsService.createNotification({
      recepient_id: agency_owner_id,
      actor_id: agency_owner_id,
      related: NotificationRelated.APPOINTMENT,
      action: NotificationAction.CREATED,
      type: NotificationType.SUCCESS,
      msg: `Appointment booked${lead_contact ? " with " + lead_contact : ""} for ${new Date(start_time).toLocaleString()}.`,
      targetId: appointmentId,
      isImportant: true,
    });
  }

  @Process(LEAD_STATUS_UPDATE_JOB)
  async handleLeadStatusUpdate(job: Job<{ leadId: string }>) {
    const { leadId } = job.data;

    await this._leadsService.updateLeads(leadId);
  }

  @Process(ESTIMATE_SENDING)
  async handleEstimateSending(job: Job) {
    const { leadId, estimates, user } = job.data;
    const conversation = await this._conversationService.getConversationByLeadId(leadId);
    await this._messageService.sendMessage({
      sender: user,
      conversation_id: conversation.id,
      direction: MessageDirection.INBOUND,
      msg: `Your estimate Link is : ${estimates}`,
    });
    // Logic to send estimate to the lead, e.g., via email or SMS
  }
  @Process("appointment_sending")
  async handleAppointmentSender(job: Job) {
    const { leadId, msg, user } = job.data;
    const conversation = await this._conversationService.getConversationByLeadId(leadId);
    await this._messageService.sendMessage({
      sender: user,
      conversation_id: conversation.id,
      direction: MessageDirection.INBOUND,
      msg,
    });
    // Logic to send estimate to the lead, e.g., via email or SMS
  }

  // ─── private helpers ──────────────────────────────────────────────────────

  private async _tryBookAppointment(sophiaResponse: string, lead: Lead, user: User): Promise<void> {
    // Only trigger when Sophia's confirmation phrase is present
    if (!sophiaResponse.toLowerCase().includes("i've got you down for")) return;

    try {
      const datetime = await this._langChain.extractAppointmentDateTime(sophiaResponse);
      if (!datetime?.start_time) {
        console.warn("[_tryBookAppointment] Confirmation phrase found but no datetime extracted");
        return;
      }

      await this._appointmentsService.create({
        agency_owner_id: user.id,
        lead_id: lead.id,
        lead_contact: lead.phone ?? lead.email ?? null,
        start_time: datetime.start_time,
        end_time: datetime.end_time,
      });

      console.log(`[_tryBookAppointment] Appointment booked for lead ${lead.id} at ${datetime.start_time}`);
    } catch (err) {
      console.error("[_tryBookAppointment] Failed to auto-book appointment", err);
    }
  }
}
