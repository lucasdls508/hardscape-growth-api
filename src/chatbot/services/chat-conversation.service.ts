import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { RedisService } from "src/redis/redis.service";
import { ClientContext, Message } from "../types/chatbot.types";

@Injectable()
export class ConversationMemoryService {
  private redis;

  constructor(
    private readonly _configService: ConfigService,
    private readonly _redisService: RedisService
  ) {}

  async onModuleInit() {
    this.redis = await this._redisService.getClient();
  }

  /**
   * Serialize context for Redis storage
   */
  private serializeContext(context: ClientContext): string {
    return JSON.stringify(context, (key, value) => {
      if (value instanceof Map) return Object.fromEntries(value);
      if (value instanceof Date) return value.toISOString();
      return value;
    });
  }

  /**
   * Deserialize context from Redis
   */
  private deserializeContext(data: string): ClientContext {
    const context = JSON.parse(data);

    // Restore Maps
    context.collectedData = new Map(Object.entries(context.collectedData || {}));

    // Restore Dates
    context.metadata.startedAt = new Date(context.metadata.startedAt);
    context.metadata.lastActivityAt = new Date(context.metadata.lastActivityAt);

    return context;
  }

  /**
   * Save message to conversation history
   */
  async saveMessage(clientId: string, message: Message): Promise<void> {
    try {
      const key = `conversation:${clientId}`;
      const serialized = JSON.stringify(message, (key, value) => {
        if (value instanceof Date) return value.toISOString();
        return value;
      });

      await this.redis.lPush(key, serialized);
      await this.redis.expire(key, 86400); // 24 hours TTL
    } catch (error) {
      console.error("Error saving message:", error);
      throw error;
    }
  }

  /**
   * Get conversation history
   */
  async getConversationHistory(clientId: string, limit: number = 50): Promise<Message[]> {
    try {
      const key = `conversation:${clientId}`;
      const messages = await this.redis.lrange(key, 0, limit - 1);

      return messages
        .map((msg) => {
          const parsed = JSON.parse(msg);
          parsed.timestamp = new Date(parsed.timestamp);
          return parsed;
        })
        .reverse();
    } catch (error) {
      console.error("Error retrieving history:", error);
      return [];
    }
  }

  /**
   * Save client context (works for both form and raw contexts)
   */
  async saveClientContext(clientId: string, context: ClientContext): Promise<void> {
    try {
      const key = `context:${clientId}`;
      const serialized = this.serializeContext(context);
      await this.redis.set(key, serialized);
      await this.redis.expire(key, 86400); // 24 hours TTL
    } catch (error) {
      console.error("Error saving context:", error);
      throw error;
    }
  }

  /**
   * Get client context
   */
  async getClientContext(clientId: string): Promise<ClientContext | null> {
    try {
      const key = `context:${clientId}`;
      const data = await this.redis.get(key);
      console.log("data", data);
      if (!data) return null;

      return this.deserializeContext(data);
    } catch (error) {
      console.error("Error retrieving context:", error);
      return null;
    }
  }

  /**
   * Clear conversation and context
   */
  async clearConversation(clientId: string): Promise<void> {
    try {
      await this.redis.del(`conversation:${clientId}`, `context:${clientId}`);
    } catch (error) {
      console.error("Error clearing conversation:", error);
      throw error;
    }
  }

  /**
   * Get all active client sessions
   */
  async getAllClientSessions(): Promise<string[]> {
    try {
      const keys = await this.redis.keys("context:*");
      return keys.map((k) => k.replace("context:", ""));
    } catch (error) {
      console.error("Error getting sessions:", error);
      return [];
    }
  }

  /**
   * Close Redis connection
   */
  async closeConnection(): Promise<void> {
    await this.redis.quit();
  }
}
