import { ConfigService } from '@nestjs/config';

export const bullmqConnection = (configService: ConfigService) => ({
  // Managed Redis providers often block CONFIG reads/updates, which causes
  // noisy startup warnings about eviction policy that cannot be changed from app code.
  skipVersionCheck: true,
  connection: {
    host: configService.get<string>('REDIS_HOST', 'localhost'),
    port: configService.get<number>('REDIS_PORT', 6379),
    password: configService.get<string>('REDIS_PASSWORD'),
  },
});
