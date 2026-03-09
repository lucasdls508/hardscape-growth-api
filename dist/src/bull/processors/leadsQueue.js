"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadsQueueProcessor = exports.APPOINTMENT_SENDING = exports.LEAD_QUEUE_JOB = void 0;
const bull_1 = require("@nestjs/bull");
const agency_profiles_service_1 = require("../../agency_profiles/agency_profiles.service");
const appointments_service_1 = require("../../appointments/appointments.service");
const chatbot_service_1 = require("../../chatbot/chatbot.service");
const conversations_service_1 = require("../../conversations/conversations.service");
const lang_chain_open_ai_service_1 = require("../../lang-chain-open-ai/lang-chain-open-ai.service");
const leads_info_service_1 = require("../../leads_info/leads_info.service");
const messages_entity_1 = require("../../messages/entities/messages.entity");
const messages_service_1 = require("../../messages/messages.service");
const notifications_entity_1 = require("../../notifications/entities/notifications.entity");
const notifications_service_1 = require("../../notifications/notifications.service");
const page_session_service_1 = require("../../page_session/page_session.service");
const redis_service_1 = require("../../redis/redis.service");
const twilio_messaging_service_1 = require("../../twilio-messaging/twilio-messaging.service");
const user_service_1 = require("../../user/user.service");
const appointments_enum_1 = require("./../../appointments/enums/appointments.enum");
exports.LEAD_QUEUE_JOB = "leads";
exports.APPOINTMENT_SENDING = "appointment_sending";
let LeadsQueueProcessor = class LeadsQueueProcessor {
    constructor(_redisService, _agencyService, _userService, _metaBuisnesService, _leadsService, _chatbotService, _conversationService, _messageService, _twilioMessagingService, _appointmentsService, _langChain, _notificationsService) {
        this._redisService = _redisService;
        this._agencyService = _agencyService;
        this._userService = _userService;
        this._metaBuisnesService = _metaBuisnesService;
        this._leadsService = _leadsService;
        this._chatbotService = _chatbotService;
        this._conversationService = _conversationService;
        this._messageService = _messageService;
        this._twilioMessagingService = _twilioMessagingService;
        this._appointmentsService = _appointmentsService;
        this._langChain = _langChain;
        this._notificationsService = _notificationsService;
    }
    async seedLead(job) {
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
        const result = await this._chatbotService.chatWithForm(lead.id, "Hey , I have provided my informations.If you need anything you can ask me .", field_data, pageInfo);
        await this._messageService.sendMessage({
            sender: user,
            conversation_id: conversations.id,
            direction: messages_entity_1.MessageDirection.INBOUND,
            msg: result.message,
        });
        await this._notificationsService.createNotification({
            recepient_id: user.id,
            actor_id: user.id,
            related: notifications_entity_1.NotificationRelated.LEAD,
            action: notifications_entity_1.NotificationAction.CREATED,
            type: notifications_entity_1.NotificationType.INFO,
            msg: `New lead arrived: ${name || "Unknown"} submitted a form.`,
            targetId: 0,
            isImportant: true,
        });
    }
    async handleSmsMessage(job) {
        const { from, body: messageText } = job.data;
        const lead = await this._leadsService.getLeadByPhone(from);
        if (!lead) {
            console.warn(`[sms-message] No lead found for phone ${from} — dropping`);
            return;
        }
        const user = await this._userService.getMe(lead.agency_id);
        if (!user?.buisness_profiles) {
            console.warn(`[sms-message] No business profile for user ${lead.agency_id} — dropping`);
            return;
        }
        const pageInfo = user.buisness_profiles;
        let conversation = await this._conversationService.getConversationByLeadId(lead.id).catch(() => null);
        if (!conversation) {
            conversation = await this._conversationService.createConversation({ lead, user });
        }
        await this._messageService.sendMessage({
            sender: user,
            conversation_id: conversation.id,
            direction: messages_entity_1.MessageDirection.OUTBOUND,
            msg: messageText,
        });
        const result = await this._chatbotService.chatRaw(lead.id, messageText, pageInfo);
        await this._messageService.sendMessage({
            sender: user,
            conversation_id: conversation.id,
            direction: messages_entity_1.MessageDirection.INBOUND,
            msg: result.message,
        });
        await this._twilioMessagingService.sendMessage({ to: from, body: result.message });
        await this._tryBookAppointment(result.message, lead, user);
        await this._notificationsService.createNotification({
            recepient_id: user.id,
            actor_id: user.id,
            related: notifications_entity_1.NotificationRelated.LEAD,
            action: notifications_entity_1.NotificationAction.CREATED,
            type: notifications_entity_1.NotificationType.INFO,
            msg: `New SMS from ${lead.name || from}: "${messageText.slice(0, 80)}"`,
            targetId: 0,
            isImportant: false,
        });
    }
    async handleMessengerMessage(job) {
        const { page_id, sender_psid, message_text } = job.data;
        const pageInfo = await this._metaBuisnesService.findByPageId(page_id);
        const user = pageInfo.users[0];
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
        let conversation = await this._conversationService.getConversationByLeadId(lead.id).catch(() => null);
        if (!conversation) {
            conversation = await this._conversationService.createConversation({ lead, user });
        }
        await this._messageService.sendMessage({
            sender: user,
            conversation_id: conversation.id,
            direction: messages_entity_1.MessageDirection.OUTBOUND,
            msg: message_text,
        });
        const result = await this._chatbotService.chatRaw(lead.id, message_text, pageInfo);
        await this._messageService.sendMessage({
            sender: user,
            conversation_id: conversation.id,
            direction: messages_entity_1.MessageDirection.INBOUND,
            msg: result.message,
        });
        if (pageInfo.access_token) {
            await this._metaBuisnesService.sendMessengerReply({
                recipient_psid: sender_psid,
                text: result.message,
                page_access_token: pageInfo.access_token,
            });
        }
        else {
            console.warn(`[messenger-message] No access_token for page ${page_id} — reply not sent to Messenger`);
        }
        await this._tryBookAppointment(result.message, lead, user);
        await this._notificationsService.createNotification({
            recepient_id: user.id,
            actor_id: user.id,
            related: notifications_entity_1.NotificationRelated.LEAD,
            action: notifications_entity_1.NotificationAction.CREATED,
            type: notifications_entity_1.NotificationType.INFO,
            msg: `New Messenger message from ${lead.name || sender_psid}: "${message_text.slice(0, 80)}"`,
            targetId: 0,
            isImportant: false,
        });
    }
    async appointmentNotification(job) {
        const { agency_owner_id, lead_contact, start_time, appointmentId } = job.data;
        await this._notificationsService.createNotification({
            recepient_id: agency_owner_id,
            actor_id: agency_owner_id,
            related: notifications_entity_1.NotificationRelated.APPOINTMENT,
            action: notifications_entity_1.NotificationAction.CREATED,
            type: notifications_entity_1.NotificationType.SUCCESS,
            msg: `Appointment booked${lead_contact ? " with " + lead_contact : ""} for ${new Date(start_time).toLocaleString()}.`,
            targetId: appointmentId,
            isImportant: true,
        });
    }
    async handleLeadStatusUpdate(job) {
        const { leadId } = job.data;
        await this._leadsService.updateLeads(leadId);
    }
    async handleEstimateSending(job) {
        const { leadId, estimates, user } = job.data;
        const conversation = await this._conversationService.getConversationByLeadId(leadId);
        await this._messageService.sendMessage({
            sender: user,
            conversation_id: conversation.id,
            direction: messages_entity_1.MessageDirection.INBOUND,
            msg: `Your estimate Link is : ${estimates}`,
        });
    }
    async handleAppointmentSender(job) {
        const { leadId, msg, user } = job.data;
        const conversation = await this._conversationService.getConversationByLeadId(leadId);
        await this._messageService.sendMessage({
            sender: user,
            conversation_id: conversation.id,
            direction: messages_entity_1.MessageDirection.INBOUND,
            msg,
        });
    }
    async _tryBookAppointment(sophiaResponse, lead, user) {
        if (!sophiaResponse.toLowerCase().includes("i've got you down for"))
            return;
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
        }
        catch (err) {
            console.error("[_tryBookAppointment] Failed to auto-book appointment", err);
        }
    }
};
exports.LeadsQueueProcessor = LeadsQueueProcessor;
__decorate([
    (0, bull_1.Process)("seed"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LeadsQueueProcessor.prototype, "seedLead", null);
__decorate([
    (0, bull_1.Process)("sms-message"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LeadsQueueProcessor.prototype, "handleSmsMessage", null);
__decorate([
    (0, bull_1.Process)("messenger-message"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LeadsQueueProcessor.prototype, "handleMessengerMessage", null);
__decorate([
    (0, bull_1.Process)(appointments_enum_1.APPOINTMENT_NOTIFICATION_JOB),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LeadsQueueProcessor.prototype, "appointmentNotification", null);
__decorate([
    (0, bull_1.Process)(appointments_enum_1.LEAD_STATUS_UPDATE_JOB),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LeadsQueueProcessor.prototype, "handleLeadStatusUpdate", null);
__decorate([
    (0, bull_1.Process)(appointments_enum_1.ESTIMATE_SENDING),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LeadsQueueProcessor.prototype, "handleEstimateSending", null);
__decorate([
    (0, bull_1.Process)("appointment_sending"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LeadsQueueProcessor.prototype, "handleAppointmentSender", null);
exports.LeadsQueueProcessor = LeadsQueueProcessor = __decorate([
    (0, bull_1.Processor)(exports.LEAD_QUEUE_JOB),
    __metadata("design:paramtypes", [redis_service_1.RedisService,
        agency_profiles_service_1.AgencyProfilesService,
        user_service_1.UserService,
        page_session_service_1.PageSessionService,
        leads_info_service_1.LeadsInfoService,
        chatbot_service_1.ChatbotService,
        conversations_service_1.ConversationsService,
        messages_service_1.MessagesService,
        twilio_messaging_service_1.TwilioMessagingService,
        appointments_service_1.AppointmentsService,
        lang_chain_open_ai_service_1.LangChainOpenAIService,
        notifications_service_1.NotificationsService])
], LeadsQueueProcessor);
//# sourceMappingURL=leadsQueue.js.map