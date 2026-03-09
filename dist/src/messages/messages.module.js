"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesModule = void 0;
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const attachment_module_1 = require("../attachment/attachment.module");
const attachments_entity_1 = require("../attachment/entiies/attachments.entity");
const auth_module_1 = require("../auth/auth.module");
const messageQueue_1 = require("../bull/processors/messageQueue");
const chatbot_module_1 = require("../chatbot/chatbot.module");
const conversations_module_1 = require("../conversations/conversations.module");
const conversations_entity_1 = require("../conversations/entities/conversations.entity");
const leads_info_module_1 = require("../leads_info/leads_info.module");
const page_session_module_1 = require("../page_session/page_session.module");
const participants_module_1 = require("../participants/participants.module");
const socket_module_1 = require("../socket/socket.module");
const user_entity_1 = require("../user/entities/user.entity");
const user_module_1 = require("../user/user.module");
const messages_entity_1 = require("./entities/messages.entity");
const messages_controller_1 = require("./messages.controller");
const messages_service_1 = require("./messages.service");
let MessagesModule = class MessagesModule {
};
exports.MessagesModule = MessagesModule;
exports.MessagesModule = MessagesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([messages_entity_1.Messages, conversations_entity_1.Conversations, user_entity_1.User, attachments_entity_1.MessageAttachment]),
            auth_module_1.AuthModule,
            socket_module_1.SocketModule,
            conversations_module_1.ConversationsModule,
            user_module_1.UserModule,
            attachment_module_1.AttachmentModule,
            participants_module_1.ParticipantsModule,
            chatbot_module_1.ChatbotModule,
            page_session_module_1.PageSessionModule,
            leads_info_module_1.LeadsInfoModule,
            bull_1.BullModule.registerQueue({ name: messageQueue_1.MESSAGE_QUEUE }),
        ],
        controllers: [messages_controller_1.MessagesController],
        providers: [messages_service_1.MessagesService],
        exports: [messages_service_1.MessagesService],
    })
], MessagesModule);
//# sourceMappingURL=messages.module.js.map