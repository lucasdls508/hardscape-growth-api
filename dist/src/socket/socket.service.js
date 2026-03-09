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
exports.SocketService = void 0;
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const conversations_entity_1 = require("../conversations/entities/conversations.entity");
const messages_entity_1 = require("../messages/entities/messages.entity");
const participants_service_1 = require("../participants/participants.service");
const user_service_1 = require("../user/user.service");
const typeorm_2 = require("typeorm");
let SocketService = class SocketService {
    constructor(_userService, _jwtService, _messageRepository, _conversationRepository, _participantService, _notificationQueue) {
        this._userService = _userService;
        this._jwtService = _jwtService;
        this._messageRepository = _messageRepository;
        this._conversationRepository = _conversationRepository;
        this._participantService = _participantService;
        this._notificationQueue = _notificationQueue;
    }
    handleDisconnection(socket) {
        const userId = socket.data?.userId;
        if (userId) {
            socket.broadcast.emit("user-offline", { userId });
        }
    }
    async handleIncomingMessage(data, server) {
        console.log("💾 Server:", server);
        server.to(`user:${data.conversationId}`).emit("new-message", data);
        console.log(`📤 Emitted to room user:${data.conversationId}`);
        return { status: "sent", messageId: data };
    }
    joinRoom({ roomkey }) {
        try {
        }
        catch (error) {
            console.log(error);
        }
    }
    sendToRoom(roomkey, event, value) {
    }
};
exports.SocketService = SocketService;
exports.SocketService = SocketService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, typeorm_1.InjectRepository)(messages_entity_1.Messages)),
    __param(3, (0, typeorm_1.InjectRepository)(conversations_entity_1.Conversations)),
    __param(5, (0, bull_1.InjectQueue)("notifications")),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        participants_service_1.ParticipantsService, Object])
], SocketService);
//# sourceMappingURL=socket.service.js.map