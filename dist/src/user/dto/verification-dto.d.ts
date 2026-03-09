export declare enum AccountStatus {
    INACTIVE = "inactive",
    ACTIVE = "active",
    BLOCKED = "blocked",
    SUSPENDED = "suspended",
    REJECTED = "rejected"
}
export declare class CreateVerificationDto {
    user_id: string;
    is_email_verified: boolean;
    is_admin_verified: boolean;
    is_suspended: boolean;
    is_deleted: boolean;
    status: AccountStatus;
}
export declare class UpdateVerificationDto {
    user_id?: number;
    is_email_verified?: boolean;
    is_seller_verified?: boolean;
    is_deleted?: boolean;
    status?: string;
}
