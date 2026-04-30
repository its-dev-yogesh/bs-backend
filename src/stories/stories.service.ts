import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Story } from './schemas/story.schema';
import { CreateStoryDto } from './dto/create-story.dto';
import { ConnectionsService } from '../connections/connections.service';
import { User } from '../users/schemas/user.schema';
import { UserProfile } from '../users/schemas/user-profile.schema';

const TTL_MS = 24 * 60 * 60 * 1000;

@Injectable()
export class StoriesService {
  constructor(
    @InjectModel(Story.name) private readonly storyModel: Model<Story>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(UserProfile.name)
    private readonly userProfileModel: Model<UserProfile>,
    private readonly connectionsService: ConnectionsService,
  ) {}

  async create(userId: string, dto: CreateStoryDto) {
    if (!userId) throw new BadRequestException('Missing user');
    const trimmedContent = (dto.content ?? '').trim();
    if (!trimmedContent && !dto.media_url) {
      throw new BadRequestException('Story needs content or media');
    }
    const created = await this.storyModel.create({
      user_id: userId,
      content: trimmedContent,
      media_url: dto.media_url,
      media_type: dto.media_type,
    });
    return { data: this.shape(created, await this.profileFor(userId)) };
  }

  /** Active stories from current user + accepted connections, grouped by author. */
  async listFeed(currentUserId: string) {
    if (!currentUserId) return { data: [] };
    const connections = await this.connectionsService.listConnections(currentUserId);
    const otherIds = (connections.data?.items ?? [])
      .map((u) => String(u.id ?? '').trim())
      .filter(Boolean);
    const authorIds = Array.from(new Set([currentUserId, ...otherIds]));

    const cutoff = new Date(Date.now() - TTL_MS);
    const stories = await this.storyModel
      .find({ user_id: { $in: authorIds }, createdAt: { $gte: cutoff } })
      .sort({ createdAt: 1 })
      .exec();

    const profiles = await this.userProfileModel
      .find({ user_id: { $in: authorIds } })
      .exec();
    const users = await this.userModel
      .find({ _id: { $in: authorIds } })
      .select('_id username')
      .exec();
    const profileById = new Map(profiles.map((p) => [p.user_id, p]));
    const userById = new Map(users.map((u) => [String(u._id), u]));

    return {
      data: stories.map((s) =>
        this.shape(s, profileById.get(s.user_id), userById.get(s.user_id)),
      ),
    };
  }

  async remove(userId: string, storyId: string) {
    const story = await this.storyModel.findById(storyId).exec();
    if (!story) throw new NotFoundException('Story not found');
    if (story.user_id !== userId) {
      throw new BadRequestException('Cannot delete another user’s story');
    }
    await this.storyModel.deleteOne({ _id: storyId }).exec();
    return { ok: true };
  }

  private async profileFor(userId: string) {
    return this.userProfileModel.findOne({ user_id: userId }).exec();
  }

  private shape(
    story: Story,
    profile?: UserProfile | null,
    user?: { _id?: string; username?: string },
  ) {
    return {
      id: story._id,
      userId: story.user_id,
      name: profile?.full_name ?? user?.username ?? 'Broker',
      username: user?.username ?? '',
      avatarUrl: profile?.avatar_url,
      content: story.content,
      mediaUrl: story.media_url,
      mediaType: story.media_type,
      createdAt: story.createdAt,
    };
  }
}
