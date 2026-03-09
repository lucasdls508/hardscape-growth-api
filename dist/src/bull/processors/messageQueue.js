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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesProcessor = exports.ADD_ATTACHMENTS_JOB = exports.UPDATE_CONVERSATION_JOB = exports.MESSAGE_QUEUE = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const conversations_service_1 = require("../../conversations/conversations.service");
exports.MESSAGE_QUEUE = "messages";
exports.UPDATE_CONVERSATION_JOB = "update-conversation";
exports.ADD_ATTACHMENTS_JOB = "add-attachments";
let MessagesProcessor = class MessagesProcessor extends bullmq_1.WorkerHost {
    constructor(_conversationService) {
        super();
        this._conversationService = _conversationService;
    }
    async process(job) {
        console.log(job);
        switch (job.name) {
            case exports.UPDATE_CONVERSATION_JOB:
                console.log("Job", job.data);
                await this._conversationService.updatedConversation(job.data);
                break;
            case "add-attachments":
                break;
        }
    }
};
exports.MessagesProcessor = MessagesProcessor;
exports.MessagesProcessor = MessagesProcessor = __decorate([
    (0, bullmq_1.Processor)(exports.MESSAGE_QUEUE),
    __metadata("design:paramtypes", [conversations_service_1.ConversationsService])
], MessagesProcessor);
//# sourceMappingURL=messageQueue.js.map