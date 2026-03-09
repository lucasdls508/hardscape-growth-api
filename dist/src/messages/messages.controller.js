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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesController = void 0;
const common_1 = require("@nestjs/common");
const get_user_decorator_1 = require("../auth/decorators/get-user.decorator");
const session_auth_guard_1 = require("../auth/guards/session-auth.guard");
const user_entity_1 = require("../user/entities/user.entity");
const message_eligability_guard_1 = require("./decorators/message-eligability.guard");
const send_message_dto_1 = require("./dto/send-message.dto");
const messages_service_1 = require("./messages.service");
let MessagesController = class MessagesController {
    constructor(_messagesService) {
        this._messagesService = _messagesService;
    }
    async getMessages(conversationId, page = 1, limit = 10) {
        const response = await this._messagesService.getMessages({
            conversationId,
            page,
            limit,
        });
        return response;
    }
    async sendMessage(conversation, conversationId, body) {
        const response = await this._messagesService.sendMessageWithAI(body, conversation[0].user, conversation);
        return response;
    }
    async sendMessages(conversation, conversationId, body, user) {
        const response = await this._messagesService.sendMessage({ ...body, sender: user });
        return response;
    }
};
exports.MessagesController = MessagesController;
__decorate([
    (0, common_1.Get)(":id"),
    (0, common_1.UseGuards)(session_auth_guard_1.JwtAuthenticationGuard),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Query)("page")),
    __param(2, (0, common_1.Query)("limit")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", Promise)
], MessagesController.prototype, "getMessages", null);
__decorate([
    (0, common_1.Post)("conversation/:id"),
    (0, common_1.UseGuards)(message_eligability_guard_1.MessageEligabilityGuard),
    __param(0, (0, get_user_decorator_1.GetConversation)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, send_message_dto_1.SendMessageTypes]),
    __metadata("design:returntype", Promise)
], MessagesController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.Post)(":id"),
    (0, common_1.UseGuards)(session_auth_guard_1.JwtAuthenticationGuard, message_eligability_guard_1.MessageEligabilityGuard),
    __param(0, (0, get_user_decorator_1.GetConversation)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, send_message_dto_1.SendMessageDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], MessagesController.prototype, "sendMessages", null);
exports.MessagesController = MessagesController = __decorate([
    (0, common_1.Controller)("messages"),
    __metadata("design:paramtypes", [messages_service_1.MessagesService])
], MessagesController);
//# sourceMappingURL=messages.controller.js.map