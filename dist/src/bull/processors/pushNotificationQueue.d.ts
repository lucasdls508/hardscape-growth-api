import { Job } from "bull";
import { FirebaseService } from "src/firebase/firebase.service";
import { MailService } from "src/mail/mail.service";
import { NotificationsService } from "src/notifications/notifications.service";
import { Logger } from "winston";
import { SinglePushNotificationPayload } from "./types";
export declare class PushNotificationProccessor {
    private readonly _firebaseService;
    private readonly _notificationsService;
    private readonly _mailService;
    private readonly _logger;
    constructor(_firebaseService: FirebaseService, _notificationsService: NotificationsService, _mailService: MailService, _logger: Logger);
    pushNotifications(job: Job<SinglePushNotificationPayload>): Promise<void>;
    m(job: Job): Promise<void>;
}
