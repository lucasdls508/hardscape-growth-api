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
var EstimatesProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EstimatesProcessor = exports.ESTIMATE_SENDING = void 0;
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const bullmq_1 = require("bullmq");
const messages_service_1 = require("../../messages/messages.service");
exports.ESTIMATE_SENDING = "estimate:sending";
let EstimatesProcessor = EstimatesProcessor_1 = class EstimatesProcessor {
    constructor(messagesService) {
        this.messagesService = messagesService;
        this.logger = new common_1.Logger(EstimatesProcessor_1.name);
    }
    async handleEstimateSending(job) {
        const { estimateId, signUrl, leadName, conversationId, preparedBy } = job.data;
        this.logger.log(`Dispatching estimate #${estimateId} sign link → ${leadName}`);
        const message = `Hi ${leadName}, your estimate is ready for review.\n\n` +
            `Please open the link below to review the details and sign:\n` +
            `${signUrl}\n\n` +
            `— ${preparedBy.first_name} ${preparedBy.last_name}`;
        this.logger.log(`Estimate #${estimateId} sign link sent successfully`);
    }
};
exports.EstimatesProcessor = EstimatesProcessor;
__decorate([
    (0, bull_1.Process)(exports.ESTIMATE_SENDING),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bullmq_1.Job]),
    __metadata("design:returntype", Promise)
], EstimatesProcessor.prototype, "handleEstimateSending", null);
exports.EstimatesProcessor = EstimatesProcessor = EstimatesProcessor_1 = __decorate([
    (0, bull_1.Processor)("estimates"),
    __metadata("design:paramtypes", [messages_service_1.MessagesService])
], EstimatesProcessor);
//# sourceMappingURL=EstimateQueue.js.map