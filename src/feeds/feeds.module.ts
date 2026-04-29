import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Feed, FeedSchema } from './schemas/feed.schema';
import { FeedsService } from './feeds.service';
import { FeedsController } from './feeds.controller';
import { PostsModule } from '../posts/posts.module';
import { AuthModule } from '../auth/auth.module';
import { ConnectionsModule } from '../connections/connections.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Feed.name, schema: FeedSchema }]),
    PostsModule,
    AuthModule,
    ConnectionsModule,
  ],
  controllers: [FeedsController],
  providers: [FeedsService],
  exports: [FeedsService],
})
export class FeedsModule {}
