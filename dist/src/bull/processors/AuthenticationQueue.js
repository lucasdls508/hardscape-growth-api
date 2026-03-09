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
exports.AuthQueueProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const firebase_service_1 = require("../../firebase/firebase.service");
const mail_service_1 = require("../../mail/mail.service");
const notifications_service_1 = require("../../notifications/notifications.service");
const otp_service_1 = require("../../otp/otp.service");
const logger_decorator_1 = require("../../shared/decorators/logger.decorator");
const user_service_1 = require("../../user/user.service");
const winston_1 = require("winston");
let AuthQueueProcessor = class AuthQueueProcessor {
    constructor(_firebaseService, _notificationsService, _mailService, _logger, _jwtService, _otpService, _userService) {
        this._firebaseService = _firebaseService;
        this._notificationsService = _notificationsService;
        this._mailService = _mailService;
        this._logger = _logger;
        this._jwtService = _jwtService;
        this._otpService = _otpService;
        this._userService = _userService;
    }
    async fcmStore(job) {
        this._logger.log("User Updated With FCM", job.data);
        const { user, fcm } = job.data;
        await this._userService.updateUser(user.id, { fcm });
    }
};
exports.AuthQueueProcessor = AuthQueueProcessor;
__decorate([
    (0, bull_1.Process)("fcm_store"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthQueueProcessor.prototype, "fcmStore", null);
exports.AuthQueueProcessor = AuthQueueProcessor = __decorate([
    (0, bull_1.Processor)("authentication"),
    (0, common_1.Injectable)(),
    __param(3, (0, logger_decorator_1.InjectLogger)()),
    __metadata("design:paramtypes", [firebase_service_1.FirebaseService,
        notifications_service_1.NotificationsService,
        mail_service_1.MailService,
        winston_1.Logger,
        jwt_1.JwtService,
        otp_service_1.OtpService,
        user_service_1.UserService])
], AuthQueueProcessor);
//# sourceMappingURL=AuthenticationQueue.js.map