import { ConfigService } from "@nestjs/config";
import { Logger } from "winston";
export declare class TwilioMessagingService {
    private readonly _configModule;
    _logger: Logger;
    private accountSid;
    private authToken;
    private phoneNumber;
    private client;
    constructor(_configModule: ConfigService, _logger: Logger);
    isConfigured(): boolean;
    sendMessage({ to, body }: {
        to: string;
        body: string;
    }): Promise<import("twilio/lib/rest/api/v2010/account/message").MessageInstance>;
    validateWebhookRequest(url: string, twilioSignature: string, requestBody: Record<string, any>): boolean;
    generateTwiMLResponse(message: string): string;
    parseIncomingMessage(body: Record<string, any>): {
        from: any;
        to: any;
        messageBody: any;
        messageSid: any;
        accountSid: any;
        numMedia: any;
        timestamp: Date;
    };
}
