"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bullmqConnection = void 0;
const bullmqConnection = (configService) => ({
    connection: {
        host: configService.get('REDIS_HOST', 'localhost'),
        port: configService.get('REDIS_PORT', 6379),
        password: configService.get('REDIS_PASSWORD'),
    },
});
exports.bullmqConnection = bullmqConnection;
//# sourceMappingURL=queue.config.js.map