"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisIoAdapter = void 0;
const platform_socket_io_1 = require("@nestjs/platform-socket.io");
const redis_1 = require("redis");
const socket_io_redis_1 = require("socket.io-redis");
class RedisIoAdapter extends platform_socket_io_1.IoAdapter {
    async connectToRedis() {
        const pubClient = (0, redis_1.createClient)({ url: "redis://localhost:6379" });
        const subClient = pubClient.duplicate();
        await Promise.all([pubClient.connect(), subClient.connect()]);
        this.adapterConstructor = (0, socket_io_redis_1.createAdapter)({
            pubClient,
            subClient,
        });
    }
    createIOServer(port, options) {
        const server = super.createIOServer(port, options);
        server.adapter(this.adapterConstructor);
        return server;
    }
}
exports.RedisIoAdapter = RedisIoAdapter;
//# sourceMappingURL=redis.adapter.js.map