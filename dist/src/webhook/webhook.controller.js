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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var WebhookController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookController = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const estimates_service_1 = require("../estimates/estimates.service");
const notifications_entity_1 = require("../notifications/entities/notifications.entity");
const notifications_service_1 = require("../notifications/notifications.service");
const page_session_service_1 = require("../page_session/page_session.service");
const logger_decorator_1 = require("../shared/decorators/logger.decorator");
const twilio_messaging_service_1 = require("../twilio-messaging/twilio-messaging.service");
const stripe_1 = __importDefault(require("stripe"));
const winston_1 = require("winston");
const webhook_service_1 = require("./webhook.service");
let WebhookController = WebhookController_1 = class WebhookController {
    constructor(_webhookService, _configService, _pageSessionService, _twilioService, _estimatesService, _notificationsService, _logger) {
        this._webhookService = _webhookService;
        this._configService = _configService;
        this._pageSessionService = _pageSessionService;
        this._twilioService = _twilioService;
        this._estimatesService = _estimatesService;
        this._notificationsService = _notificationsService;
        this._logger = _logger;
    }
    async handleStripeWebhook(rawBody, signature) {
        const endpointSecret = this._configService.get("STRIPE_WEBHOOK_SECRET");
        let event;
        try {
            event = stripe_1.default.webhooks.constructEvent(rawBody, signature, endpointSecret);
        }
        catch (err) {
            console.error("Stripe signature verification failed:", err.message);
            throw new common_1.HttpException("Webhook signature verification failed", common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            switch (event.type) {
                case "checkout.session.completed": {
                    const session = event.data.object;
                    const paid = await this._estimatesService.markDepositPaid(session.id);
                    if (paid) {
                        await this._notificationsService.createNotification({
                            recepient_id: paid.prepared_by,
                            actor_id: paid.prepared_by,
                            related: notifications_entity_1.NotificationRelated.ESTIMATE,
                            action: notifications_entity_1.NotificationAction.UPDATED,
                            type: notifications_entity_1.NotificationType.SUCCESS,
                            msg: `Deposit received for Estimate #${paid.id}. Project is confirmed.`,
                            targetId: paid.id,
                            isImportant: true,
                        });
                    }
                    break;
                }
                default:
                    this._logger.log(`Unhandled Stripe event: ${event.type}`, WebhookController_1.name);
            }
        }
        catch (err) {
            console.error("Error processing Stripe event:", err);
        }
        return { received: true };
    }
    verifyFacebookWebhook(mode, token, challenge) {
        const VERIFY_TOKEN = "1qazxsw2";
        if (mode === "subscribe" && token === VERIFY_TOKEN) {
            console.log("WEBHOOK_VERIFIED");
            return challenge;
        }
        else {
            console.log("VERIFICATION_FAILED");
            throw new common_1.HttpException("Verification failed", common_1.HttpStatus.FORBIDDEN);
        }
    }
    async handleFacebookLead(body) {
        console.log("Incoming webhook event:", JSON.stringify(body, null, 2));
        if (body.object === "page") {
            for (const entry of body.entry) {
                if (entry.changes?.length) {
                    for (const change of entry.changes) {
                        if (change.field === "leadgen") {
                            const page_id = change.value.page_id;
                            const form_id = change.value.form_id;
                            const lead_id = change.value.leadgen_id;
                            if (!page_id) {
                                console.log("Page ID not found in the webhook payload.");
                                continue;
                            }
                            const validate_page = await this._pageSessionService.validateMetaPageExists(page_id);
                            if (!validate_page?.data?.[page_id]) {
                                console.log(`No data found for page ID: ${page_id}`);
                                continue;
                            }
                            const validate_lead = await this._pageSessionService.leadInformations({
                                access_token: validate_page.data[page_id].access_token,
                                lead_id,
                            });
                            await this._webhookService.handleMetaWebhhook({
                                page_id,
                                lead_id,
                                form_id,
                                leadInfo: validate_lead.data,
                                field_data: validate_lead.data.field_data,
                            });
                        }
                    }
                }
                if (entry.messaging?.length) {
                    for (const event of entry.messaging) {
                        if (!event.message?.text)
                            continue;
                        await this._webhookService.handleMessengerMessage({
                            page_id: entry.id,
                            sender_psid: event.sender.id,
                            message_text: event.message.text,
                            timestamp: event.timestamp,
                        });
                    }
                }
            }
        }
        return "EVENT_RECEIVED";
    }
    async handleMinIOWebhook(event) {
        console.log("Received MinIO webhook event");
        const record = event.Records[0];
        const eventName = record.eventName;
        const bucketName = record.s3.bucket.name;
        const objectKey = record.s3.object.key;
        const objectSize = record.s3.object.size;
        const eventTime = record.eventTime;
        const sourceIP = record.requestParameters.sourceIPAddress;
        this._logger.log(`Time: ${eventTime} Event: ${eventName} Object: ${objectKey}`, WebhookController_1.name);
        this._logger.log(`USER FIELD DATA: ${JSON.stringify(record.s3.object?.userMetadata)}`, "Webhook");
        if (eventName === "s3:ObjectCreated:Put") {
            await this._webhookService.handleFileUpload(bucketName, {
                key: objectKey,
                field: record.s3.object?.userMetadata["x-amz-meta-field"],
                user_id: record.s3.object?.userMetadata["x-amz-meta-user_id"],
            });
        }
        else if (eventName === "s3:ObjectRemoved:Delete") {
            await this._webhookService.handleFileDelete(bucketName, objectKey);
        }
        return { status: "received" };
    }
    async handleIncomingSms(body, twilioSignature) {
        try {
            const url = `${this._configService.get("WEBHOOK_URL")}/webhook/sms`;
            const isValid = this._twilioService.validateWebhookRequest(url, twilioSignature, body);
            if (!isValid) {
                this._logger.warn(`Unauthorized SMS webhook attempt`);
                throw new common_1.BadRequestException("Invalid Twilio signature");
            }
            const { from, to, messageBody } = this._twilioService.parseIncomingMessage(body);
            this._logger.info(`Incoming SMS from ${from}`);
            await this._webhookService.handleSmsMessage({ from, to, body: messageBody });
        }
        catch (error) {
            this._logger.error(`Error handling incoming SMS`, { error });
        }
        return this._twilioService.generateTwiMLResponse("");
    }
};
exports.WebhookController = WebhookController;
__decorate([
    (0, common_1.Post)("stripe"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)("stripe-signature")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Buffer, String]),
    __metadata("design:returntype", Promise)
], WebhookController.prototype, "handleStripeWebhook", null);
__decorate([
    (0, common_1.Get)("facebook"),
    __param(0, (0, common_1.Query)("hub.mode")),
    __param(1, (0, common_1.Query)("hub.verify_token")),
    __param(2, (0, common_1.Query)("hub.challenge")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], WebhookController.prototype, "verifyFacebookWebhook", null);
__decorate([
    (0, common_1.Post)("facebook"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WebhookController.prototype, "handleFacebookLead", null);
__decorate([
    (0, common_1.Post)("minio"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WebhookController.prototype, "handleMinIOWebhook", null);
__decorate([
    (0, common_1.Post)("sms"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)("x-twilio-signature")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WebhookController.prototype, "handleIncomingSms", null);
exports.WebhookController = WebhookController = WebhookController_1 = __decorate([
    (0, common_1.Controller)("webhook"),
    __param(6, (0, logger_decorator_1.InjectLogger)()),
    __metadata("design:paramtypes", [webhook_service_1.WebhookService,
        config_1.ConfigService,
        page_session_service_1.PageSessionService,
        twilio_messaging_service_1.TwilioMessagingService,
        estimates_service_1.EstimatesService,
        notifications_service_1.NotificationsService,
        winston_1.Logger])
], WebhookController);
//# sourceMappingURL=webhook.controller.js.map