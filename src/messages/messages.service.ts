import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';
import {
  NotificationType,
} from '../notifications/schemas/notification.schema';
import { NotificationsService } from '../notifications/notifications.service';
import { SendMessageDto } from './dto/send-message.dto';
import { Message } from './schemas/message.schema';
import { MessageThread } from './schemas/message-thread.schema';

@Injectable()
export class MessagesService {
  private readonly logger = new Logger(MessagesService.name);
  constructor(
    @InjectModel(MessageThread.name)
    private readonly threadModel: Model<MessageThread>,
    @InjectModel(Message.name) private readonly messageModel: Model<Message>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async listThreads(currentUserId: string) {
    const threads = await this.threadModel
      .find({ participant_ids: currentUserId })
      .sort({ last_message_at: -1 })
      .limit(50)
      .exec();

    const userIds = Array.from(
      new Set(threads.flatMap((t) => t.participant_ids).filter(Boolean)),
    );
    const users = await this.userModel
      .find({ _id: { $in: userIds } })
      .select('_id username')
      .exec();
    const userMap = new Map(users.map((u) => [u._id, u]));

    return {
      data: {
        items: threads.map((t) => ({
          id: t._id,
          participants: t.participant_ids.map((id) => ({
            id,
            name: userMap.get(id)?.username ?? 'Broker',
            avatarUrl: undefined,
          })),
          lastMessageAt:
            t.last_message_at?.toISOString() ?? new Date().toISOString(),
          unreadCount: 0,
          preview: t.last_message ?? '',
        })),
        nextCursor: null,
        total: threads.length,
      },
    };
  }

  async getThreadMessages(currentUserId: string, threadId: string) {
    const thread = await this.threadModel.findById(threadId).exec();
    if (!thread || !thread.participant_ids.includes(currentUserId)) {
      throw new NotFoundException('Thread not found');
    }

    const messages = await this.messageModel
      .find({ thread_id: threadId })
      .sort({ createdAt: 1 })
      .limit(200)
      .exec();

    return {
      data: {
        items: messages.map((m) => ({
          id: m._id,
          threadId: m.thread_id,
          senderId: m.sender_id,
          body: m.body,
          createdAt: m.createdAt?.toISOString() ?? new Date().toISOString(),
        })),
        nextCursor: null,
        total: messages.length,
      },
    };
  }

  async send(currentUserId: string, threadId: string, dto: SendMessageDto) {
    let thread = await this.threadModel.findById(threadId).exec();
    if (!thread) {
      if (!dto.targetUserId) {
        throw new BadRequestException('targetUserId required for new thread');
      }
      thread = await this.threadModel.create({
        _id: threadId,
        participant_ids: [currentUserId, dto.targetUserId],
      });
    }
    if (!thread.participant_ids.includes(currentUserId)) {
      throw new BadRequestException('Not a participant');
    }

    const msg = await this.messageModel.create({
      thread_id: thread._id,
      sender_id: currentUserId,
      body: dto.body,
      read: false,
    });
    thread.last_message = dto.body;
    thread.last_message_at = new Date();
    await thread.save();

    const recipientIds = thread.participant_ids.filter((id) => id !== currentUserId);
    await Promise.all(
      recipientIds.map((uid) =>
        this.notificationsService.create(
          uid,
          NotificationType.MESSAGE,
          currentUserId,
          `/messages?thread=${threadId}`,
        ),
      ),
    );
    this.logger.log(
      `broker_buyer_conversation_event thread=${threadId} sender=${currentUserId}`,
    );

    return {
      data: {
        id: msg._id,
        threadId: msg.thread_id,
        senderId: msg.sender_id,
        body: msg.body,
        createdAt: msg.createdAt?.toISOString() ?? new Date().toISOString(),
      },
    };
  }
}
