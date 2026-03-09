import { NotificationAction, NotificationRelated, NotificationType } from "src/notifications/entities/notifications.entity";
import { User } from "src/user/entities/user.entity";
import { UserRoles } from "src/user/enums/role.enum";
export interface NotificationJobPayload {
    user: User;
    action: NotificationAction;
    msg: string;
    isImportant?: boolean;
    related: NotificationRelated;
    targetId?: number;
    notificationFor?: string;
    title?: string;
    body?: string;
}
export interface PushNotificationPayload {
    tokens: string[];
    title: string;
    body: string;
}
export interface SinglePushNotificationPayload {
    token: string;
    title: string;
    body: string;
}
export interface MultipleNotificationPayload {
    recepient_id: string;
    recepient?: User;
    actor_id: string;
    related: NotificationRelated;
    action: NotificationAction;
    type?: NotificationType;
    msg: string;
    targetId?: number;
    notificationFor?: UserRoles;
    isImportant?: boolean;
    title?: string;
    body?: string;
}
