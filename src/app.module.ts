import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PermissionsModule } from './permissions/permissions.module';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { FeedsModule } from './feeds/feeds.module';
import { FollowsModule } from './follows/follows.module';
import { InquiriesModule } from './inquiries/inquiries.module';
import { MeModule } from './me/me.module';
import { QueuesModule } from './queues/queues.module';
import { UploadModule } from './upload/upload.module';
import { SeedModule } from './seed/seed.module';
import { mongooseConfig } from './config/database.config';
import { redisConfig } from './config/redis.config';
import { ConnectionsModule } from './connections/connections.module';
import { MessagesModule } from './messages/messages.module';
import { NotificationsModule } from './notifications/notifications.module';
import { VerificationModule } from './verification/verification.module';
import { ModerationModule } from './moderation/moderation.module';
import { SearchModule } from './search/search.module';
import { LeadsModule } from './leads/leads.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { MonetizationModule } from './monetization/monetization.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: mongooseConfig,
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: redisConfig,
    }),
    QueuesModule,
    UsersModule,
    PermissionsModule,
    AuthModule,
    PostsModule,
    FollowsModule,
    InquiriesModule,
    FeedsModule,
    MeModule,
    UploadModule,
    SeedModule,
    ConnectionsModule,
    MessagesModule,
    NotificationsModule,
    VerificationModule,
    ModerationModule,
    SearchModule,
    LeadsModule,
    AnalyticsModule,
    MonetizationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
