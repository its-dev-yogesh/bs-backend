import { Global, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { bullmqConnection } from '../config/queue.config';
import {
  QUEUE_MEDIA_PROCESSING,
  QUEUE_PHONE_OTP,
  QUEUE_POST_FANOUT,
} from './queue.constants';
import { Feed, FeedSchema } from '../feeds/schemas/feed.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { PostFanoutProcessor } from './processors/post-fanout.processor';
import { MediaProcessingProcessor } from './processors/media-processing.processor';
import { PhoneOtpProcessor } from './processors/phone-otp.processor';

@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: bullmqConnection,
    }),
    BullModule.registerQueue(
      { name: QUEUE_POST_FANOUT },
      { name: QUEUE_MEDIA_PROCESSING },
      { name: QUEUE_PHONE_OTP },
    ),
    MongooseModule.forFeature([
      { name: Feed.name, schema: FeedSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [PostFanoutProcessor, MediaProcessingProcessor, PhoneOtpProcessor],
  exports: [BullModule],
})
export class QueuesModule {}
