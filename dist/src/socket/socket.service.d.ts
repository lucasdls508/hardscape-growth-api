import { JwtService } from "@nestjs/jwt";
import { Queue } from "bull";
import { Server, Socket } from "socket.io";
import { Conversations } from "src/conversations/entities/conversations.entity";
import { Messages } from "src/messages/entities/messages.entity";
import { ParticipantsService } from "src/participants/participants.service";
import { UserService } from "src/user/user.service";
import { Repository } from "typeorm";
export declare class SocketService {
    private readonly _userService;
    private readonly _jwtService;
    private readonly _messageRepository;
    private readonly _conversationRepository;
    private readonly _participantService;
    private readonly _notificationQueue;
    constructor(_userService: UserService, _jwtService: JwtService, _messageRepository: Repository<Messages>, _conversationRepository: Repository<Conversations>, _participantService: ParticipantsService, _notificationQueue: Queue);
    handleDisconnection(socket: Socket): void;
    handleIncomingMessage(data: any, server: Server): Promise<{
        status: string;
        messageId: any;
    }>;
    joinRoom({ roomkey }: {
        roomkey: string;
    }): void;
    sendToRoom(roomkey: string, event: string, value: any): void;
}
