import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectLogger } from "src/shared/decorators/logger.decorator";
import * as twilio from "twilio";
import { Twilio } from "twilio";
import { Logger } from "winston";

@Injectable()
export class TwilioMessagingService {
  private accountSid: string = "";
  private authToken: string = "";
  private phoneNumber: string = "";
  private client: Twilio;

  constructor(
    private readonly _configModule: ConfigService,
    @InjectLogger() public _logger: Logger
  ) {
    this.accountSid = this._configModule.get<string>("TWILIO_ACCOUNT_SID");
    this.authToken = this._configModule.get<string>("TWILIO_AUTH_TOKEN");
    this.phoneNumber = this._configModule.get<string>("TWILIO_PHONE_NUMBER");
    if (this.accountSid && this.authToken && this.phoneNumber) {
      this.client = new Twilio(this.accountSid, this.authToken);
    }
  }

  isConfigured(): boolean {
    return !!this.client;
  }

  async sendMessage({ to, body }: { to: string; body: string }) {
    if (!this.client) {
      this._logger.warn(`Twilio not configured — skipping SMS to ${to}`);
      return null;
    }
    try {
      this._logger.info(`Twilio sending message to ${to}`, { body });
      return await this.client.messages.create({
        body,
        from: this.phoneNumber,
        to,
      });
    } catch (error) {
      this._logger.error(`Twilio Error sending message`, { error, to, body });
      throw error;
    }
  }

  /**
   * Validate incoming webhook request is from Twilio
   */
  validateWebhookRequest(url: string, twilioSignature: string, requestBody: Record<string, any>): boolean {
    try {
      const isValid = twilio.validateRequest(this.authToken, twilioSignature, url, requestBody);

      if (!isValid) {
        this._logger.warn(`Invalid Twilio signature`, { url });
      }

      return isValid;
    } catch (error) {
      this._logger.error(`Error validating webhook request`, { error, url });
      return false;
    }
  }

  /**
   * Generate TwiML response for incoming messages
   */
  generateTwiMLResponse(message: string): string {
    try {
      const response = new twilio.twiml.MessagingResponse();
      response.message(message);
      return response.toString();
    } catch (error) {
      this._logger.error(`Error generating TwiML response`, { error, message });
      throw error;
    }
  }

  /**
   * Parse incoming SMS message
   */
  parseIncomingMessage(body: Record<string, any>) {
    return {
      from: body.From,
      to: body.To,
      messageBody: body.Body,
      messageSid: body.MessageSid,
      accountSid: body.AccountSid,
      numMedia: body.NumMedia,
      timestamp: new Date(),
    };
  }
}
