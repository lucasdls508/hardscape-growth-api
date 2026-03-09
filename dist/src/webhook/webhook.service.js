"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookService = void 0;
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const redis_service_1 = require("../redis/redis.service");
const primary_path_enum_1 = require("../s3/enums/primary-path.enum");
const logger_decorator_1 = require("../shared/decorators/logger.decorator");
const user_service_1 = require("../user/user.service");
const stripe_1 = __importDefault(require("stripe"));
const winston_1 = require("winston");
const leadsProfile_1 = require("./utils/leadsProfile");
let WebhookService = class WebhookService {
    constructor(_configService, _logger, _redisService, _uploadQueue, _leadQueue, _userService) {
        this._configService = _configService;
        this._logger = _logger;
        this._redisService = _redisService;
        this._uploadQueue = _uploadQueue;
        this._leadQueue = _leadQueue;
        this._userService = _userService;
        this.stripe = new stripe_1.default(this._configService.get("STRIPE_SECRET_KEY"), {
            apiVersion: "2025-08-27.basil",
        });
        this.baseUrl = this._configService.get("BASE_URL");
    }
    async createPaymentIntent(amount, user) {
        try {
            const session = await this.stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                line_items: [
                    {
                        price_data: {
                            currency: "GBP",
                            product_data: {
                                name: `Recharge ${amount}`,
                                description: `Recharge the wallet for phurcase and product boosting`,
                            },
                            unit_amount: amount * 100,
                        },
                        quantity: 1,
                    },
                ],
                metadata: {
                    user_id: user.id,
                    amount: amount,
                    email: user.email,
                    name: user.first_name,
                },
                mode: "payment",
                customer_email: user.email,
                success_url: `${this.baseUrl}/html-response/complete?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${this.baseUrl}/html-response/cancel`,
            });
            return session.url;
        }
        catch (error) {
            console.error("Error creating payment intent:", error.message);
            throw new common_1.BadGatewayException(`Failed to create payment : ${error.message}`);
        }
    }
    async findMetaData(payment) {
        const session = await this.stripe.checkout.sessions.retrieve(payment);
        console.log(session);
        if (!session.metadata) {
            console.error("Metadata not found in session.");
        }
        return session.metadata;
    }
    async getPaymentIntent(paymentIntend) {
        const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntend);
        return paymentIntent;
    }
    async paymentIntentList() {
        const paymentIntent = await this.stripe.paymentIntents.list({ limit: 10 });
        return paymentIntent;
    }
    async handleFileUpload(bucket, payload) {
        const { user_id, field, key } = payload;
        const client = this._redisService.getClient();
        const cacheKey = `s3_batch:${user_id}`;
        const jobId = `flush:${user_id}`;
        const pushData = {
            user_id,
        };
        switch (field) {
            case primary_path_enum_1.S3_Field.User_Profile:
                pushData["image"] = key;
                break;
            case primary_path_enum_1.S3_Field.Agency_Nid_Front:
                pushData["nid_front"] = key;
                break;
            case primary_path_enum_1.S3_Field.Agency_Nid_Back:
                pushData["nid_back"] = key;
                break;
            case primary_path_enum_1.S3_Field.Agency_Tax_Front:
                pushData["tax_id_front"] = key;
                break;
            case primary_path_enum_1.S3_Field.Agency_Tax_Back:
                pushData["tax_id_back"] = key;
                break;
            case primary_path_enum_1.S3_Field.Agency_Driving_License_Front:
                pushData["driving_license_front"] = key;
                break;
            case primary_path_enum_1.S3_Field.Agency_Driving_License_Back:
                pushData["driving_license_back"] = key;
                break;
            case primary_path_enum_1.S3_Field.User_Profile:
                pushData["image"] = key;
                break;
            default:
                break;
        }
        await client.hSet(cacheKey, pushData);
        const allFields = await client.hGetAll(cacheKey);
        const count = Object.keys(allFields).length;
        if (count >= 5) {
            console.log("Processed immediately");
            const existingJob = await this._uploadQueue.getJob(jobId);
            if (existingJob)
                await existingJob.remove();
            await this._uploadQueue.add("process-bulk", { user_id }, { jobId });
        }
        else {
            console.log("Triggered after 1 seconds");
            await this._uploadQueue.add("process-bulk", { pushData }, {
                delay: 3000,
            });
        }
    }
    async handleMetaWebhhook({ page_id, lead_id, form_id, leadInfo, field_data, }) {
        const destructedLeadsInfo = (0, leadsProfile_1.parseLeadInfo)(leadInfo);
        await this._leadQueue.add("seed", {
            page_id,
            lead_id,
            form_id,
            destructedLeadsInfo,
            field_data,
        });
        console.log("LEADS INFORMATION", destructedLeadsInfo);
    }
    async handleSmsMessage({ from, to, body }) {
        await this._leadQueue.add("sms-message", { from, to, body });
    }
    async handleMessengerMessage({ page_id, sender_psid, message_text, timestamp, }) {
        await this._leadQueue.add("messenger-message", {
            page_id,
            sender_psid,
            message_text,
            timestamp,
        });
    }
    async handleFileDelete(bucket, key) {
        console.log(`File deleted: ${bucket}/${key}`);
    }
    async seedLeads() { }
};
exports.WebhookService = WebhookService;
exports.WebhookService = WebhookService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, logger_decorator_1.InjectLogger)()),
    __param(3, (0, bull_1.InjectQueue)("uploadQueue")),
    __param(4, (0, bull_1.InjectQueue)("leads")),
    __metadata("design:paramtypes", [config_1.ConfigService,
        winston_1.Logger,
        redis_service_1.RedisService, Object, Object, user_service_1.UserService])
], WebhookService);
//# sourceMappingURL=webhook.service.js.map