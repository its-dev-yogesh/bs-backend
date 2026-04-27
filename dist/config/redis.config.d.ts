import { ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
export declare const redisConfig: (configService: ConfigService) => {
    store: typeof redisStore;
    host: string | undefined;
    port: number | undefined;
    password: string | undefined;
    ttl: number;
};
