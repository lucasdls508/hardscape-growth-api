import { UserService } from "src/user/user.service";
export declare class FirebaseService {
    private readonly userService;
    private readonly logger;
    constructor(userService: UserService);
    sendPushNotification(token: string, title: string, body: string): Promise<string>;
    sendPushNotificationToMultiple(tokens: string[], title: string, body: string): Promise<import("firebase-admin/lib/messaging/messaging-api").BatchResponse>;
    findUserFcmAndSendPushNotification({ userId, title, body, }: {
        userId: string;
        title: string;
        body: string;
    }): Promise<void>;
}
