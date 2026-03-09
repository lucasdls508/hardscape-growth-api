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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const mailer_1 = require("@nestjs-modules/mailer");
const common_1 = require("@nestjs/common");
const constants_1 = require("./constants");
const mail_1 = __importDefault(require("@sendgrid/mail"));
const logger_decorator_1 = require("../shared/decorators/logger.decorator");
let MailService = class MailService {
    get name() {
        return this._name;
    }
    set name(value) {
        this._name = value;
    }
    get from() {
        return this._from;
    }
    set from(value) {
        this._from = value;
    }
    constructor(_mailService, _logger) {
        this._mailService = _mailService;
        this._logger = _logger;
        this._name = constants_1.ORG_NAME;
        this._from = constants_1.FROM_EMAIL;
        mail_1.default.setApiKey(process.env.SENDGRID_API_KEY);
    }
    async sendUserConfirmationMail(user, url) {
        const subject = `Welcome to Your Pet Attix! Hi ${user.first_name}, Here's Your Account Activation Code`;
        this._mailService.sendMail({
            to: user.email,
            subject: subject,
            template: "welcome",
            context: {
                subject: "",
                header: "",
                first_name: user.first_name,
                last_name: user.last_name,
                url,
            },
        });
    }
    async sendEmailChangeOtp(email, otp) {
        await this._mailService.sendMail({
            to: email,
            subject: "Verify Your New Email",
            html: `<h3>Your OTP is: ${otp}</h3>`,
        });
    }
    async sendUserActivationToken(user, url) {
        this._mailService.sendMail({
            to: user.email,
            subject: "",
            template: "account-activation",
            context: {
                subject: "",
                header: "",
                first_name: user.first_name,
                url,
            },
        });
    }
    async sendUserAccountActivationMail(user, url) {
        this._mailService.sendMail({
            to: user.email,
            subject: "",
            template: "confirm-activation",
            context: {
                subject: "",
                header: "",
                first_name: user.first_name,
                url,
            },
        });
    }
    async sendForgotPasswordMail(email, url) {
        this._mailService.sendMail({
            to: email,
            subject: "Forgot Password Verification code from Pet Attix",
            template: "forgot-password",
            context: {
                subject: "Forgot Password Verification code from Pet Attix",
                header: "",
                url,
                year: new Date().getFullYear(),
            },
        });
    }
    async sendPasswordResetConfirmationMail(user) {
        this._mailService.sendMail({
            to: user.email,
            subject: "",
            template: "reset-password",
            context: {
                subject: "",
                header: "",
            },
        });
    }
    async sendPasswordUpdateEmail(user) {
        this._mailService.sendMail({
            to: user.email,
            subject: `Password Updated!`,
            template: "update-password",
            context: {
                subject: "",
                header: "",
                first_name: user.first_name,
            },
        });
    }
    async sendUserDeletionMail(user) {
        this._mailService.sendMail({
            to: user.email,
            subject: "",
            template: "account-deletion",
            context: {
                subject: "",
                header: "",
                first_name: user.first_name,
            },
        });
    }
    async sendConfirmationOnUpdatingUser(user) {
        this._mailService.sendMail({
            to: user.email,
            subject: "",
            template: "user-updation",
            context: {
                subject: "",
                header: "",
                first_name: user.first_name,
            },
        });
    }
};
exports.MailService = MailService;
exports.MailService = MailService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, logger_decorator_1.InjectLogger)()),
    __metadata("design:paramtypes", [mailer_1.MailerService, Object])
], MailService);
//# sourceMappingURL=mail.service.js.map