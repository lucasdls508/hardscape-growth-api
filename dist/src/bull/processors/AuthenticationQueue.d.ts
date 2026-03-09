import { Job } from "bull";
import { JwtService } from "@nestjs/jwt";
import { FirebaseService } from "src/firebase/firebase.service";
import { MailService } from "src/mail/mail.service";
import { NotificationsService } from "src/notifications/notifications.service";
import { OtpService } from "src/otp/otp.service";
import { User } from "src/user/entities/user.entity";
import { UserService } from "src/user/user.service";
import { Logger } from "winston";
export declare class AuthQueueProcessor {
    private readonly _firebaseService;
    private readonly _notificationsService;
    private readonly _mailService;
    private readonly _logger;
    private readonly _jwtService;
    private readonly _otpService;
    private readonly _userService;
    constructor(_firebaseService: FirebaseService, _notificationsService: NotificationsService, _mailService: MailService, _logger: Logger, _jwtService: JwtService, _otpService: OtpService, _userService: UserService);
    fcmStore(job: Job<{
        user: User;
        fcm: string;
    }>): Promise<void>;
}
