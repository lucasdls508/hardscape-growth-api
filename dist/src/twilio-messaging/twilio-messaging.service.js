"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwilioMessagingService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const logger_decorator_1 = require("../shared/decorators/logger.decorator");
const twilio = __importStar(require("twilio"));
const twilio_1 = require("twilio");
const winston_1 = require("winston");
let TwilioMessagingService = class TwilioMessagingService {
    constructor(_configModule, _logger) {
        this._configModule = _configModule;
        this._logger = _logger;
        this.accountSid = "";
        this.authToken = "";
        this.phoneNumber = "";
        this.accountSid = this._configModule.get("TWILIO_ACCOUNT_SID");
        this.authToken = this._configModule.get("TWILIO_AUTH_TOKEN");
        this.phoneNumber = this._configModule.get("TWILIO_PHONE_NUMBER");
        if (this.accountSid && this.authToken && this.phoneNumber) {
            this.client = new twilio_1.Twilio(this.accountSid, this.authToken);
        }
    }
    isConfigured() {
        return !!this.client;
    }
    async sendMessage({ to, body }) {
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
        }
        catch (error) {
            this._logger.error(`Twilio Error sending message`, { error, to, body });
            throw error;
        }
    }
    validateWebhookRequest(url, twilioSignature, requestBody) {
        try {
            const isValid = twilio.validateRequest(this.authToken, twilioSignature, url, requestBody);
            if (!isValid) {
                this._logger.warn(`Invalid Twilio signature`, { url });
            }
            return isValid;
        }
        catch (error) {
            this._logger.error(`Error validating webhook request`, { error, url });
            return false;
        }
    }
    generateTwiMLResponse(message) {
        try {
            const response = new twilio.twiml.MessagingResponse();
            response.message(message);
            return response.toString();
        }
        catch (error) {
            this._logger.error(`Error generating TwiML response`, { error, message });
            throw error;
        }
    }
    parseIncomingMessage(body) {
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
};
exports.TwilioMessagingService = TwilioMessagingService;
exports.TwilioMessagingService = TwilioMessagingService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, logger_decorator_1.InjectLogger)()),
    __metadata("design:paramtypes", [config_1.ConfigService,
        winston_1.Logger])
], TwilioMessagingService);
//# sourceMappingURL=twilio-messaging.service.js.map