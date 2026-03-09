import { User } from "src/user/entities/user.entity";
import { NotificationRelated } from "./entities/notifications.entity";
import { NotificationsService } from "./notifications.service";
export declare class NotificationsController {
    private readonly notificationService;
    constructor(notificationService: NotificationsService);
    getNotifications(user: User, req: any, page: number, limit: number, isRead: boolean, related: NotificationRelated, isImportant: boolean, notificationFor: string): Promise<import("./types/notification.response").GetNotificationsResponse>;
}
