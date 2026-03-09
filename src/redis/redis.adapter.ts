import { IoAdapter } from "@nestjs/platform-socket.io";
import { createClient } from "redis";
import { createAdapter } from "socket.io-redis";

export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor: ReturnType<typeof createAdapter>;

  async connectToRedis(): Promise<void> {
    const redisUrl = process.env.REDIS_URL || `redis://${process.env.REDIS_IP || "localhost"}:${process.env.REDIS_PORT || 6379}`;
    const pubClient = createClient({ url: redisUrl });
    const subClient = pubClient.duplicate();

    await Promise.all([pubClient.connect(), subClient.connect()]);

    this.adapterConstructor = createAdapter({
      pubClient,
      subClient,
    });
  }

  createIOServer(port: number, options?: any): any {
    const server = super.createIOServer(port, options);
    server.adapter(this.adapterConstructor);
    return server;
  }
}
