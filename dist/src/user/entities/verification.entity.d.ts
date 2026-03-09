import { User } from "./user.entity";
export declare class Verification {
    id: number;
    user_id: string;
    is_email_verified: boolean;
    user: User;
    is_admin_verified: boolean;
    is_suspended: boolean;
    is_deleted: boolean;
    status: string;
}
