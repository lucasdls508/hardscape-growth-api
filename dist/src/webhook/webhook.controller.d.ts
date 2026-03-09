import { ConfigService } from "@nestjs/config";
import { EstimatesService } from "src/estimates/estimates.service";
import { NotificationsService } from "src/notifications/notifications.service";
import { PageSessionService } from "src/page_session/page_session.service";
import { FacebookWebhookPayload } from "src/page_session/types/webhook.types";
import { TwilioMessagingService } from "src/twilio-messaging/twilio-messaging.service";
import { Logger } from "winston";
import { WebhookService } from "./webhook.service";
export declare class WebhookController {
    private readonly _webhookService;
    private readonly _configService;
    private readonly _pageSessionService;
    private readonly _twilioService;
    private readonly _estimatesService;
    private readonly _notificationsService;
    private readonly _logger;
    constructor(_webhookService: WebhookService, _configService: ConfigService, _pageSessionService: PageSessionService, _twilioService: TwilioMessagingService, _estimatesService: EstimatesService, _notificationsService: NotificationsService, _logger: Logger);
    handleStripeWebhook(rawBody: Buffer, signature: string): Promise<{
        received: boolean;
    }>;
    verifyFacebookWebhook(mode: string, token: string, challenge: string): string;
    handleFacebookLead(body: FacebookWebhookPayload): Promise<string>;
    handleMinIOWebhook(event: WebhookEvent): Promise<{
        status: string;
    }>;
    handleIncomingSms(body: Record<string, any>, twilioSignature: string): Promise<string>;
}
