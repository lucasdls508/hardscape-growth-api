import { UserRole } from "aws-sdk/clients/workmail";
import { User } from "src/user/entities/user.entity";
export declare enum NotificationRelated {
    PRODUCT = "product",
    ORDER = "order",
    CONVERSATION = "conversation",
    WALLET = "wallet",
    LEAD = "lead",
    APPOINTMENT = "appointment",
    ESTIMATE = "estimate"
}
export declare enum NotificationType {
    INFO = "info",
    SUCCESS = "success",
    ERROR = "error"
}
export declare enum NotificationAction {
    CREATED = "created",
    UPDATED = "updated",
    DELETED = "deleted"
}
export declare class Notifications {
    id: number;
    recepient: User;
    actor: User;
    msg: string;
    notificationFor: UserRole;
    related: NotificationRelated;
    action: NotificationAction;
    type: NotificationType;
    target_id: number;
    isRead: boolean;
    isImportant: boolean;
    created_at: Date;
    updated_at: Date;
}
