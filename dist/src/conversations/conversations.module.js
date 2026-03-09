"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_1 = require("../auth/auth.module");
const messages_entity_1 = require("../messages/entities/messages.entity");
const participants_module_1 = require("../participants/participants.module");
const socket_module_1 = require("../socket/socket.module");
const user_module_1 = require("../user/user.module");
const conversations_controller_1 = require("./conversations.controller");
const conversations_service_1 = require("./conversations.service");
const conversations_entity_1 = require("./entities/conversations.entity");
let ConversationsModule = class ConversationsModule {
};
exports.ConversationsModule = ConversationsModule;
exports.ConversationsModule = ConversationsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([conversations_entity_1.Conversations, messages_entity_1.Messages]),
            participants_module_1.ParticipantsModule,
            user_module_1.UserModule,
            auth_module_1.AuthModule,
            socket_module_1.SocketModule,
        ],
        providers: [conversations_service_1.ConversationsService],
        controllers: [conversations_controller_1.ConversationsController],
        exports: [conversations_service_1.ConversationsService],
    })
], ConversationsModule);
//# sourceMappingURL=conversations.module.js.map