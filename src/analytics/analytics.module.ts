import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnalyticsController } from './analytics.controller';
import { User, UserSchema } from '../users/schemas/user.schema';
import { Post, PostSchema } from '../posts/schemas/post.schema';
import { Lead, LeadSchema } from '../leads/schemas/lead.schema';
import {
  KycRequest,
  KycRequestSchema,
} from '../verification/schemas/kyc-request.schema';
import { Report, ReportSchema } from '../moderation/schemas/report.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Post.name, schema: PostSchema },
      { name: Lead.name, schema: LeadSchema },
      { name: KycRequest.name, schema: KycRequestSchema },
      { name: Report.name, schema: ReportSchema },
    ]),
    AuthModule,
  ],
  controllers: [AnalyticsController],
})
export class AnalyticsModule {}
