import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Feed, FeedSchema } from './schemas/feed.schema';
import { FeedsService } from './feeds.service';
import { FeedsController } from './feeds.controller';
import { PostsModule } from '../posts/posts.module';
import { AuthModule } from '../auth/auth.module';
import { FollowsModule } from '../follows/follows.module';
import { InquiriesModule } from '../inquiries/inquiries.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Feed.name, schema: FeedSchema }]),
    PostsModule,
    AuthModule,
    FollowsModule,
    InquiriesModule,
    UsersModule,
  ],
  controllers: [FeedsController],
  providers: [FeedsService],
  exports: [FeedsService],
})
export class FeedsModule {}
