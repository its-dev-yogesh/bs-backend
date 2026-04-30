import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';
import {
  ConnectionRequest,
  ConnectionRequestStatus,
} from './schemas/connection-request.schema';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../notifications/schemas/notification.schema';

export type ViewerRelationship = {
  isConnected: boolean;
  pendingOutgoing: boolean;
  pendingIncoming: boolean;
  /** Mongo id of the ConnectionRequest when viewer must accept or decline (incoming pending). */
  pendingRequestId?: string;
};

@Injectable()
export class ConnectionsService {
  constructor(
    @InjectModel(ConnectionRequest.name)
    private readonly requestModel: Model<ConnectionRequest>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly notificationsService: NotificationsService,
  ) {}

  /** Number of accepted connections (edges) for this user. */
  async countAcceptedConnections(userId: string): Promise<number> {
    return this.requestModel.countDocuments({
      status: ConnectionRequestStatus.ACCEPTED,
      $or: [{ from_user_id: userId }, { to_user_id: userId }],
    });
  }

  /** Relationship between viewer and profile user (same user → all false). */
  async getRelationship(
    viewerId: string,
    profileUserId: string,
  ): Promise<ViewerRelationship> {
    if (!viewerId || !profileUserId || viewerId === profileUserId) {
      return {
        isConnected: false,
        pendingOutgoing: false,
        pendingIncoming: false,
      };
    }

    const doc = await this.requestModel
      .findOne({
        $or: [
          { from_user_id: viewerId, to_user_id: profileUserId },
          { from_user_id: profileUserId, to_user_id: viewerId },
        ],
      })
      .exec();

    if (!doc) {
      return {
        isConnected: false,
        pendingOutgoing: false,
        pendingIncoming: false,
      };
    }

    if (doc.status === ConnectionRequestStatus.ACCEPTED) {
      return {
        isConnected: true,
        pendingOutgoing: false,
        pendingIncoming: false,
      };
    }

    if (doc.status === ConnectionRequestStatus.PENDING) {
      const pendingIncoming = doc.to_user_id === viewerId;
      return {
        isConnected: false,
        pendingOutgoing: doc.from_user_id === viewerId,
        pendingIncoming,
        pendingRequestId: pendingIncoming ? String(doc._id) : undefined,
      };
    }

    return {
      isConnected: false,
      pendingOutgoing: false,
      pendingIncoming: false,
    };
  }

  async listConnections(currentUserId: string) {
    const accepted = await this.requestModel
      .find({
        status: ConnectionRequestStatus.ACCEPTED,
        $or: [{ from_user_id: currentUserId }, { to_user_id: currentUserId }],
      })
      .sort({ updatedAt: -1 })
      .exec();

    const otherIds = accepted.map((c) =>
      c.from_user_id === currentUserId ? c.to_user_id : c.from_user_id,
    );
    const users = await this.userModel
      .find({ _id: { $in: otherIds } })
      .select('_id username')
      .exec();

    return {
      data: {
        items: users.map((u) => ({
          id: u._id,
          username: u.username,
          name: u.username,
          avatarUrl: undefined,
        })),
        nextCursor: null,
        total: users.length,
      },
    };
  }

  async suggestions(currentUserId: string) {
    const edges = await this.requestModel
      .find({
        $or: [{ from_user_id: currentUserId }, { to_user_id: currentUserId }],
      })
      .select('from_user_id to_user_id')
      .exec();
    const excluded = new Set<string>([currentUserId]);
    edges.forEach((e) => {
      excluded.add(e.from_user_id);
      excluded.add(e.to_user_id);
    });

    const users = await this.userModel
      .find({ _id: { $nin: Array.from(excluded) } })
      .limit(20)
      .select('_id username')
      .exec();

    return {
      data: users.map((u) => ({
        id: u._id,
        username: u.username,
        name: u.username,
        avatarUrl: undefined,
      })),
    };
  }

  async sendRequest(fromUserId: string, toUserId: string) {
    if (fromUserId === toUserId) {
      throw new BadRequestException('Cannot send request to self');
    }

    /** Look at both directions — a pending request from the other side means
     *  this is really a "Follow Back" and should accept rather than open a
     *  duplicate edge that leaves both users stuck in PENDING. */
    const existing = await this.requestModel
      .findOne({
        $or: [
          { from_user_id: fromUserId, to_user_id: toUserId },
          { from_user_id: toUserId, to_user_id: fromUserId },
        ],
      })
      .exec();
    if (existing) {
      if (
        existing.status === ConnectionRequestStatus.PENDING &&
        existing.from_user_id === toUserId &&
        existing.to_user_id === fromUserId
      ) {
        existing.status = ConnectionRequestStatus.ACCEPTED;
        await existing.save();
        await this.notificationsService.create(
          toUserId,
          NotificationType.CONNECTION_REQUEST,
          fromUserId,
          '/network',
        );
        return { data: existing };
      }
      if (existing.status === ConnectionRequestStatus.DECLINED) {
        existing.status = ConnectionRequestStatus.PENDING;
        existing.from_user_id = fromUserId;
        existing.to_user_id = toUserId;
        await existing.save();
        await this.notificationsService.create(
          toUserId,
          NotificationType.CONNECTION_REQUEST,
          fromUserId,
          '/network',
        );
        return { data: existing };
      }
      return { data: existing };
    }

    const request = await this.requestModel.create({
      from_user_id: fromUserId,
      to_user_id: toUserId,
      status: ConnectionRequestStatus.PENDING,
    });
    await this.notificationsService.create(
      toUserId,
      NotificationType.CONNECTION_REQUEST,
      fromUserId,
      '/network',
    );
    return { data: request };
  }

  async acceptRequest(currentUserId: string, requestId: string) {
    const request = await this.requestModel.findById(requestId).exec();
    if (!request) throw new NotFoundException('Request not found');
    if (request.to_user_id !== currentUserId) {
      throw new BadRequestException('Not allowed to accept this request');
    }

    request.status = ConnectionRequestStatus.ACCEPTED;
    await request.save();
    /** Tell the original requester (from_user_id) their request was accepted. */
    await this.notificationsService.create(
      request.from_user_id,
      NotificationType.CONNECTION_REQUEST,
      currentUserId,
      '/network',
    );
    return { data: request };
  }

  async removeConnection(currentUserId: string, otherUserId: string) {
    if (!currentUserId || !otherUserId) {
      throw new BadRequestException('Missing user id');
    }
    if (currentUserId === otherUserId) {
      throw new BadRequestException('Cannot disconnect from self');
    }
    const result = await this.requestModel
      .deleteMany({
        $or: [
          { from_user_id: currentUserId, to_user_id: otherUserId },
          { from_user_id: otherUserId, to_user_id: currentUserId },
        ],
      })
      .exec();
    return { ok: true, removed: result.deletedCount ?? 0 };
  }

  async declineRequest(currentUserId: string, requestId: string) {
    const request = await this.requestModel.findById(requestId).exec();
    if (!request) throw new NotFoundException('Request not found');
    if (request.to_user_id !== currentUserId) {
      throw new BadRequestException('Not allowed to decline this request');
    }

    request.status = ConnectionRequestStatus.DECLINED;
    await request.save();
    return { data: request };
  }
}
