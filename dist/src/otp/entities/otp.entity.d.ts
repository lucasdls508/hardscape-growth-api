import { User } from "src/user/entities/user.entity";
export declare enum OtpType {
    LOGIN = "login",
    REGISTRATION = "registration",
    FORGOT_PASSWORD = "forgot_password",
    VERIFY_EMAIL = "verify_email",
    VERIFY_PHONE = "verify_phone",
    TWO_FACTOR_AUTH = "two_factor_auth",
    RESET_PASSWORD = "reset_password",
    CHANGE_EMAIL = "change_email",
    CHANGE_PHONE = "change_phone",
    CUSTOM = "custom"
}
export declare class Otp {
    id: number;
    otp: string;
    user_id: string;
    type: OtpType;
    attempts: number;
    user: User;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
