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
exports.SocketGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const redis_service_1 = require("../redis/redis.service");
const socket_service_1 = require("./socket.service");
let SocketGateway = class SocketGateway {
    afterInit() {
        console.log("✅ Socket.IO server initialized");
    }
    constructor(_socketService, _redisService) {
        this._socketService = _socketService;
        this._redisService = _redisService;
    }
    async handleConnection(socket) {
        const userId = socket.handshake.query.userId;
        if (!userId)
            return socket.disconnect(true);
        const room = [`user:3001`, `user:3002`];
        room?.forEach((element) => {
            socket.join(element);
        });
        await this._redisService.getClient().hSet("online_users", userId, socket.id);
        console.log(`🟢 ${userId} is online (socket: ${socket.id})`);
        socket.broadcast.emit("user-online", { userId });
    }
    handleDisconnect(client) {
        console.log(client.handshake.query.userId);
        this._redisService
            .getClient()
            .hDel("online_users", client.handshake.query.userId)
            .then((res) => {
            console.log(`🔴 ${client.handshake.query.userId} went offline`, res);
        })
            .catch((err) => {
            console.log(err);
        });
        this._socketService.handleDisconnection(client);
    }
    handleMessage(data) {
        const room = `user:${data.to}`;
        this.server.to(room).emit("message", data);
    }
    handlePing(data) {
        console.log("🏓 Received ping");
        return { value: "pong" };
    }
};
exports.SocketGateway = SocketGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], SocketGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)("message"),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SocketGateway.prototype, "handleMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("ping"),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SocketGateway.prototype, "handlePing", null);
exports.SocketGateway = SocketGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: ["https://petattix.merinasib.shop", "http://localhost:4500"],
        },
    }),
    __metadata("design:paramtypes", [socket_service_1.SocketService,
        redis_service_1.RedisService])
], SocketGateway);
//# sourceMappingURL=socket.gateway.js.map