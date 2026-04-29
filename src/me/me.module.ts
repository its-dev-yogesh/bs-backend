import { Module } from '@nestjs/common';
import { MeController } from './me.controller';
import { MeService } from './me.service';
import { PostsModule } from '../posts/posts.module';
import { FollowsModule } from '../follows/follows.module';
import { InquiriesModule } from '../inquiries/inquiries.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PostsModule, FollowsModule, InquiriesModule, AuthModule],
  controllers: [MeController],
  providers: [MeService],
})
export class MeModule {}
