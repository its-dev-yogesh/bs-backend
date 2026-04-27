import { ConfigService } from '@nestjs/config';
import { MongooseModuleFactoryOptions } from '@nestjs/mongoose';

export const mongooseConfig = (
  configService: ConfigService,
): MongooseModuleFactoryOptions => ({
  uri: configService.get<string>('MONGODB_URI'),
  user: configService.get<string>('MONGODB_USER'),
  pass: configService.get<string>('MONGODB_PASSWORD'),
  dbName: configService.get<string>('MONGODB_DATABASE'),
});
