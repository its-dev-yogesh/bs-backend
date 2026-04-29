import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';
import {
  Notification,
  NotificationType,
} from './schemas/notification.schema';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<Notification>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(
    userId: string,
    type: NotificationType,
    actorId: string,
    link?: string,
  ) {
    return this.notificationModel.create({
      user_id: userId,
      type,
      actor_id: actorId,
      link,
      read: false,
    });
  }

  async list(userId: string) {
    const notifications = await this.notificationModel
      .find({ user_id: userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .exec();

    const actorIds = Array.from(new Set(notifications.map((n) => n.actor_id)));
    const actors = await this.userModel
      .find({ _id: { $in: actorIds } })
      .select('_id username')
      .exec();
    const actorMap = new Map(actors.map((a) => [a._id, a]));

    return notifications.map((n) => {
      const actor = actorMap.get(n.actor_id);
      return {
        id: n._id,
        type: n.type,
        actor: {
          id: actor?._id ?? n.actor_id,
          name: actor?.username ?? 'Broker',
          avatarUrl: undefined,
        },
        read: n.read,
        link: n.link,
        createdAt: n.createdAt,
      };
    });
  }

  async unreadCount(userId: string) {
    const count = await this.notificationModel
      .countDocuments({ user_id: userId, read: false })
      .exec();
    return { count };
  }

  async markRead(userId: string, id: string) {
    await this.notificationModel
      .updateOne({ _id: id, user_id: userId }, { $set: { read: true } })
      .exec();
    return { ok: true };
  }

  async markAllRead(userId: string) {
    await this.notificationModel
      .updateMany({ user_id: userId, read: false }, { $set: { read: true } })
      .exec();
    return { ok: true };
  }
}
