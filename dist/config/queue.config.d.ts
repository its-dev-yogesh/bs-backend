import { ConfigService } from '@nestjs/config';
export declare const bullmqConnection: (configService: ConfigService) => {
    connection: {
        host: string;
        port: number;
        password: string | undefined;
    };
};
