import { ConfigService } from "@nestjs/config";
import { Queue } from "bull";
import { RedisService } from "src/redis/redis.service";
import { User } from "src/user/entities/user.entity";
import { Field, LeadgenLead } from "src/page_session/types/leadgen.types";
import { UserService } from "src/user/user.service";
import Stripe from "stripe";
import { Logger } from "winston";
export declare class WebhookService {
    private _configService;
    private readonly _logger;
    private readonly _redisService;
    private readonly _uploadQueue;
    private readonly _leadQueue;
    private readonly _userService;
    private stripe;
    baseUrl: string;
    constructor(_configService: ConfigService, _logger: Logger, _redisService: RedisService, _uploadQueue: Queue, _leadQueue: Queue, _userService: UserService);
    createPaymentIntent(amount: number, user: User): Promise<string>;
    findMetaData(payment: string): Promise<any>;
    getPaymentIntent(paymentIntend: string): Promise<Stripe.Response<Stripe.PaymentIntent>>;
    paymentIntentList(): Promise<Stripe.Response<Stripe.ApiList<Stripe.PaymentIntent>>>;
    handleFileUpload(bucket: string, payload: {
        user_id: string;
        field: string;
        key: string;
    }): Promise<void>;
    handleMetaWebhhook({ page_id, lead_id, form_id, leadInfo, field_data, }: {
        page_id: string;
        lead_id: string;
        form_id: string;
        leadInfo: LeadgenLead;
        field_data: Field[];
    }): Promise<void>;
    handleSmsMessage({ from, to, body }: {
        from: string;
        to: string;
        body: string;
    }): Promise<void>;
    handleMessengerMessage({ page_id, sender_psid, message_text, timestamp, }: {
        page_id: string;
        sender_psid: string;
        message_text: string;
        timestamp: number;
    }): Promise<void>;
    handleFileDelete(bucket: string, key: string): Promise<void>;
    seedLeads(): Promise<void>;
}
