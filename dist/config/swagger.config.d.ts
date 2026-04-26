import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare const setupSwagger: (app: INestApplication, configService: ConfigService) => void;
export declare const setupProductionSwagger: (app: INestApplication, configService: ConfigService) => void;
