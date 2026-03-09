import { MailerService } from "@nestjs-modules/mailer";
import { LoggerService } from "@nestjs/common";
import { User } from "../user/entities/user.entity";
export declare class MailService {
    private readonly _mailService;
    private readonly _logger;
    private _name;
    get name(): string;
    set name(value: string);
    private _from;
    get from(): string;
    set from(value: string);
    constructor(_mailService: MailerService, _logger: LoggerService);
    sendUserConfirmationMail(user: User, url: string): Promise<void>;
    sendEmailChangeOtp(email: string, otp: string): Promise<void>;
    sendUserActivationToken(user: User, url: string): Promise<void>;
    sendUserAccountActivationMail(user: User, url: string): Promise<void>;
    sendForgotPasswordMail(email: string, url: string): Promise<void>;
    sendPasswordResetConfirmationMail(user: User): Promise<void>;
    sendPasswordUpdateEmail(user: User): Promise<void>;
    sendUserDeletionMail(user: User): Promise<void>;
    sendConfirmationOnUpdatingUser(user: User): Promise<void>;
}
