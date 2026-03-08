import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Post,
  Query,
} from "@nestjs/common";

// import { ConfigService } from 'aws-sdk';

import { ConfigService } from "@nestjs/config";
import { EstimatesService } from "src/estimates/estimates.service";
import {
  NotificationAction,
  NotificationRelated,
  NotificationType,
} from "src/notifications/entities/notifications.entity";
import { NotificationsService } from "src/notifications/notifications.service";
import { PageSessionService } from "src/page_session/page_session.service";
import { FacebookWebhookPayload } from "src/page_session/types/webhook.types";
import { InjectLogger } from "src/shared/decorators/logger.decorator";
import { TwilioMessagingService } from "src/twilio-messaging/twilio-messaging.service";
import Stripe from "stripe";
import { Logger } from "winston";
import { WebhookService } from "./webhook.service";

@Controller("webhook")
export class WebhookController {
  constructor(
    private readonly _webhookService: WebhookService,
    private readonly _configService: ConfigService,
    private readonly _pageSessionService: PageSessionService,
    private readonly _twilioService: TwilioMessagingService,
    private readonly _estimatesService: EstimatesService,
    private readonly _notificationsService: NotificationsService,

    @InjectLogger() private readonly _logger: Logger
  ) {}

  //   @Post('payment')
  // @UseGuards(JwtAuthenticationGuard)
  // async createPaymentIntent(
  //   @GetUser() user : User,
  //   @Body() body:RechargeDto
  // ) {
  //   const {  amount } = body;
  //   const paymentIntent = await this.stripeService.createPaymentIntent(
  //     amount,
  //     user,
  //   );
  //   return { paymentIntent };
  // }

  // Webhook handler for Stripe events
  @Post("stripe")
  async handleStripeWebhook(@Body() rawBody: Buffer, @Headers("stripe-signature") signature: string) {
    const endpointSecret = this._configService.get<string>("STRIPE_WEBHOOK_SECRET");
    // console.log(endpointSecret)
    // 1. Verify signature — throw 400 if invalid
    let event: ReturnType<typeof Stripe.webhooks.constructEvent>;
    try {
      event = Stripe.webhooks.constructEvent(rawBody, signature, endpointSecret);
    } catch (err) {
      console.error("Stripe signature verification failed:", err.message);
      throw new HttpException("Webhook signature verification failed", HttpStatus.BAD_REQUEST);
    }

    // 2. Handle verified event — errors here are 500s, not 400s
    try {
      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object as Stripe.Checkout.Session;
          const paid = await this._estimatesService.markDepositPaid(session.id);
          if (paid) {
            await this._notificationsService.createNotification({
              recepient_id: paid.prepared_by,
              actor_id: paid.prepared_by,
              related: NotificationRelated.ESTIMATE,
              action: NotificationAction.UPDATED,
              type: NotificationType.SUCCESS,
              msg: `Deposit received for Estimate #${paid.id}. Project is confirmed.`,
              targetId: paid.id,
              isImportant: true,
            });
          }
          break;
        }
        default:
          this._logger.log(`Unhandled Stripe event: ${event.type}`, WebhookController.name);
      }
    } catch (err) {
      console.error("Error processing Stripe event:", err);
      // Still return 200 so Stripe doesn't retry; log for investigation
    }

    return { received: true };
  }

  @Get("facebook")
  verifyFacebookWebhook(
    @Query("hub.mode") mode: string,
    @Query("hub.verify_token") token: string,
    @Query("hub.challenge") challenge: string
  ) {
    // MUST match exactly what you put in the Facebook Developer Portal
    const VERIFY_TOKEN = "1qazxsw2";

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("WEBHOOK_VERIFIED");
      // Return the challenge as a raw string
      return challenge;
    } else {
      console.log("VERIFICATION_FAILED");
      // This is why you are seeing the 403 error
      throw new HttpException("Verification failed", HttpStatus.FORBIDDEN);
    }
  }

  @Post("facebook")
  async handleFacebookLead(@Body() body: FacebookWebhookPayload) {
    console.log("Incoming webhook event:", JSON.stringify(body, null, 2));

    if (body.object === "page") {
      for (const entry of body.entry) {
        // ── Leadgen form submissions ──────────────────────────────────────────
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

        // ── Messenger direct messages ─────────────────────────────────────────
        if (entry.messaging?.length) {
          for (const event of entry.messaging) {
            if (!event.message?.text) continue; // skip delivery/read receipts

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

    // Always return 200 OK quickly to acknowledge receipt
    return "EVENT_RECEIVED";
  }

  @Post("minio")
  async handleMinIOWebhook(@Body() event: WebhookEvent) {
    console.log("Received MinIO webhook event");

    const record = event.Records[0];
    const eventName = record.eventName;
    const bucketName = record.s3.bucket.name;
    const objectKey = record.s3.object.key;
    const objectSize = record.s3.object.size;
    const eventTime = record.eventTime;
    const sourceIP = record.requestParameters.sourceIPAddress;

    this._logger.log(`Time: ${eventTime} Event: ${eventName} Object: ${objectKey}`, WebhookController.name);
    this._logger.log(`USER FIELD DATA: ${JSON.stringify(record.s3.object?.userMetadata)}`, "Webhook");
    // Process based on event type
    if (eventName === "s3:ObjectCreated:Put") {
      await this._webhookService.handleFileUpload(bucketName, {
        key: objectKey,
        field: record.s3.object?.userMetadata["x-amz-meta-field"],
        user_id: record.s3.object?.userMetadata["x-amz-meta-user_id"],
      });
    } else if (eventName === "s3:ObjectRemoved:Delete") {
      await this._webhookService.handleFileDelete(bucketName, objectKey);
    }

    return { status: "received" };
  }

  @Post("sms")
  async handleIncomingSms(
    @Body() body: Record<string, any>,
    @Headers("x-twilio-signature") twilioSignature: string
  ) {
    try {
      const url = `${this._configService.get("WEBHOOK_URL")}/webhook/sms`;
      const isValid = this._twilioService.validateWebhookRequest(url, twilioSignature, body);

      if (!isValid) {
        this._logger.warn(`Unauthorized SMS webhook attempt`);
        throw new BadRequestException("Invalid Twilio signature");
      }

      const { from, to, messageBody } = this._twilioService.parseIncomingMessage(body);
      this._logger.info(`Incoming SMS from ${from}`);

      await this._webhookService.handleSmsMessage({ from, to, body: messageBody });
    } catch (error) {
      this._logger.error(`Error handling incoming SMS`, { error });
    }

    // Always return empty TwiML — Twilio expects XML, not an error
    return this._twilioService.generateTwiMLResponse("");
  }
}
