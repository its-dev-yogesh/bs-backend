import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationsModule } from '../notifications/notifications.module';
import { LeadsModule } from '../leads/leads.module';
import { Post, PostSchema } from '../posts/schemas/post.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { Message, MessageSchema } from './schemas/message.schema';
import {
  MessageThread,
  MessageThreadSchema,
} from './schemas/message-thread.schema';

@Module({
  imports: [
    NotificationsModule,
    LeadsModule,
    MongooseModule.forFeature([
      { name: MessageThread.name, schema: MessageThreadSchema },
      { name: Message.name, schema: MessageSchema },
      { name: User.name, schema: UserSchema },
      { name: Post.name, schema: PostSchema },
    ]),
  ],
  controllers: [MessagesController],
  providers: [MessagesService],
  exports: [MessagesService],
})
export class MessagesModule {}
