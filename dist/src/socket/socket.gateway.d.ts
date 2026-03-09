import { OnGatewayConnection, OnGatewayDisconnect } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { RedisService } from "src/redis/redis.service";
import { SocketService } from "./socket.service";
export declare class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly _socketService;
    private readonly _redisService;
    server: Server;
    afterInit(): void;
    constructor(_socketService: SocketService, _redisService: RedisService);
    handleConnection(socket: Socket): Promise<Socket<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any>>;
    handleDisconnect(client: any): void;
    handleMessage(data: any): void;
    handlePing(data: any): {
        value: string;
    };
}
