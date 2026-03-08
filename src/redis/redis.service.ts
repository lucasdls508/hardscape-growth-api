// src/redis/redis.service.ts

import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Cache } from "cache-manager";
import { createClient } from "redis";
import { InjectLogger } from "src/shared/decorators/logger.decorator";
import { Logger } from "winston";

export type RedisClient = ReturnType<typeof createClient>;

@Injectable()
export class RedisService implements OnModuleInit {
  private readonly client: RedisClient;

  constructor(
    @Inject(CACHE_MANAGER) private readonly _cacheManager: Cache,
    @InjectLogger() private readonly _logger: Logger,
    private readonly _configService: ConfigService
  ) {
    this.client = createClient({
      socket: {
        host: this._configService.get<string>("REDIS_HOST"),
        port: this._configService.get<number>("REDIS_PORT"),
      },
      // password: this._configService.get<string>("REDIS_PASSWORD"),
    });
  }

  async onModuleInit() {
    if (!this.client.isOpen) {
      this._logger.log("Redis connecting...", RedisService);
      await this.client.connect();
      this._logger.log("Redis connected successfully", RedisService);
    }
  }

  /* ---------------- CACHE MANAGER ---------------- */

  async setCache<T>(key: string, value: T): Promise<void> {
    await this._cacheManager.set(key, value);
  }
  async set(key: string, value: any, ttl: number): Promise<void> {
    await this.client.hSet(key, "data", JSON.stringify(value));
    await this.client.expire(key, ttl);
  }
  async del(key: string): Promise<void> {
    await this.client.del(key);
  }
  async get(key: string) {
    return await this.client.hGet(key, "data").then((res) => (res ? JSON.parse(res) : null));
  }

  async setCacheWithTTL<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
    await this._cacheManager.set(key, value, ttlSeconds);
    this._logger.debug(`Cache set: ${key} (TTL ${ttlSeconds}s)`);
  }

  async getCache<T = any>(key: string): Promise<T | null> {
    return (await this._cacheManager.get(key)) as T | null;
  }

  async delCache(key: string): Promise<void> {
    await this._cacheManager.del(key);
  }

  async exists(key: string): Promise<boolean> {
    return (await this.client.exists(key)) === 1;
  }

  /* ---------------- SAFE PATTERN DELETE (SCAN) ---------------- */

  async deleteByPattern(pattern: string): Promise<void> {
    let cursor = 0;

    do {
      const { cursor: nextCursor, keys } = await this.client.scan(cursor, {
        MATCH: pattern,
        COUNT: 100,
      });

      cursor = nextCursor;

      if (keys.length) {
        await this.client.del(keys);
        this._logger.debug(`Deleted keys: ${keys.join(", ")}`);
      }
    } while (cursor !== 0);
  }

  /* ---------------- RAW REDIS CLIENT ---------------- */

  getClient(): RedisClient {
    return this.client;
  }
  async getHash(key: string): Promise<Record<string, string>> {
    return await this.client.hGetAll(key);
  }
  async setHash(key: string, value: Record<string, string>): Promise<void> {
    await this.client.hSet(key, value);
  }
  async deleteHash(key: string): Promise<void> {
    await this.client.del(key);
  }
  async getList(key: string): Promise<string[]> {
    return await this.client.lRange(key, 0, -1);
  }
  async pushToList(key: string, value: string): Promise<void> {
    await this.client.rPush(key, value);
  }
  async deleteList(key: string): Promise<void> {
    await this.client.del(key);
  }

  /* ---------------- LOGIN ATTEMPTS EXAMPLE ---------------- */

  async getLoginAttempts(key: string): Promise<number> {
    const value = await this.client.get(key);
    return value ? Number(value) : 0;
  }

  async incrementLoginAttempts(key: string): Promise<number> {
    const count = await this.client.incr(key);

    if (count === 1) {
      await this.client.expire(key, 600); // 10 minutes
    }

    return count;
  }

  async resetLoginAttempts(key: string): Promise<void> {
    await this.client.del(key);
  }
}
