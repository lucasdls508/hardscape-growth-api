import { ConfigService } from "@nestjs/config";
import { RedisService } from "src/redis/redis.service";
import { ClientContext, Message } from "../types/chatbot.types";
export declare class ConversationMemoryService {
    private readonly _configService;
    private readonly _redisService;
    private redis;
    constructor(_configService: ConfigService, _redisService: RedisService);
    onModuleInit(): Promise<void>;
    private serializeContext;
    private deserializeContext;
    saveMessage(clientId: string, message: Message): Promise<void>;
    getConversationHistory(clientId: string, limit?: number): Promise<Message[]>;
    saveClientContext(clientId: string, context: ClientContext): Promise<void>;
    getClientContext(clientId: string): Promise<ClientContext | null>;
    clearConversation(clientId: string): Promise<void>;
    getAllClientSessions(): Promise<string[]>;
    closeConnection(): Promise<void>;
}
