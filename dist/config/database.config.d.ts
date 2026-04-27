import { ConfigService } from '@nestjs/config';
import { MongooseModuleFactoryOptions } from '@nestjs/mongoose';
export declare const mongooseConfig: (configService: ConfigService) => MongooseModuleFactoryOptions;
