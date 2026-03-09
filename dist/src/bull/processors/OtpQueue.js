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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpQueueProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const firebase_service_1 = require("../../firebase/firebase.service");
const mail_service_1 = require("../../mail/mail.service");
const notifications_service_1 = require("../../notifications/notifications.service");
const otp_service_1 = require("../../otp/otp.service");
const logger_decorator_1 = require("../../shared/decorators/logger.decorator");
const winston_1 = require("winston");
let OtpQueueProcessor = class OtpQueueProcessor {
    constructor(_firebaseService, _notificationsService, _mailService, _logger, _jwtService, _otpService) {
        this._firebaseService = _firebaseService;
        this._notificationsService = _notificationsService;
        this._mailService = _mailService;
        this._logger = _logger;
        this._jwtService = _jwtService;
        this._otpService = _otpService;
    }
    async otpCreation(job) {
        this._logger.log("OTP Creation Job started", job.data);
        console.log("OTP Creation ", job.data);
        const { user, otpType } = job.data;
        const otp = await this._otpService.createOtp(user.id, otpType);
        console.log(otp);
        this._logger.log("Sending welcome email", job.data);
        this._mailService.sendUserConfirmationMail(user, otp.otp);
    }
};
exports.OtpQueueProcessor = OtpQueueProcessor;
__decorate([
    (0, bull_1.Process)("create"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OtpQueueProcessor.prototype, "otpCreation", null);
exports.OtpQueueProcessor = OtpQueueProcessor = __decorate([
    (0, bull_1.Processor)("otp"),
    (0, common_1.Injectable)(),
    __param(3, (0, logger_decorator_1.InjectLogger)()),
    __metadata("design:paramtypes", [firebase_service_1.FirebaseService,
        notifications_service_1.NotificationsService,
        mail_service_1.MailService,
        winston_1.Logger,
        jwt_1.JwtService,
        otp_service_1.OtpService])
], OtpQueueProcessor);
//# sourceMappingURL=OtpQueue.js.map