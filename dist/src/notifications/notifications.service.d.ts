import { UserRoles } from "src/user/enums/role.enum";
import { Repository } from "typeorm";
import { NotificationAction, NotificationRelated, Notifications, NotificationType } from "./entities/notifications.entity";
import { GetNotificationsResponse } from "./types/notification.response";
export declare class NotificationsService {
    private readonly _notificationsRepository;
    constructor(_notificationsRepository: Repository<Notifications>);
    createNotification({ recepient_id, actor_id, related, action, type, msg, targetId, notificationFor, isImportant, }: {
        recepient_id: string;
        actor_id: string;
        related: NotificationRelated;
        action: NotificationAction;
        type?: NotificationType;
        msg: string;
        targetId: number;
        notificationFor?: string;
        isImportant?: boolean;
    }): Promise<Notifications>;
    bulkInsertNotifications(notificationsData: {
        recepient_id: string;
        actor_id: string;
        related: NotificationRelated;
        action: NotificationAction;
        type?: NotificationType;
        msg: string;
        targetId?: number;
        notificationFor?: UserRoles;
        isImportant?: boolean;
    }[]): Promise<Notifications[]>;
    getNotifications({ recepient_id, page, limit, notificationFor, }: {
        recepient_id: string;
        page: number;
        limit: number;
        isRead: boolean;
        related: string;
        isImportant: boolean;
        notificationFor: string;
    }): Promise<GetNotificationsResponse>;
}
