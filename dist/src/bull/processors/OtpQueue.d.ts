import { Job } from "bull";
import { OtpType } from "src/otp/entities/otp.entity";
import { JwtService } from "@nestjs/jwt";
import { FirebaseService } from "src/firebase/firebase.service";
import { MailService } from "src/mail/mail.service";
import { NotificationsService } from "src/notifications/notifications.service";
import { OtpService } from "src/otp/otp.service";
import { User } from "src/user/entities/user.entity";
import { Logger } from "winston";
export declare class OtpQueueProcessor {
    private readonly _firebaseService;
    private readonly _notificationsService;
    private readonly _mailService;
    private readonly _logger;
    private readonly _jwtService;
    private readonly _otpService;
    constructor(_firebaseService: FirebaseService, _notificationsService: NotificationsService, _mailService: MailService, _logger: Logger, _jwtService: JwtService, _otpService: OtpService);
    otpCreation(job: Job<{
        user: User;
        otpType: OtpType;
    }>): Promise<void>;
}
