import { Job } from "bull";
import { MailService } from "src/mail/mail.service";
export declare class EmailProcessor {
    private readonly _mailService;
    constructor(_mailService: MailService);
    OrderConfirmation(job: Job): Promise<void>;
}
