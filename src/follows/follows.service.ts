import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Follow } from './schemas/follow.schema';

@Injectable()
export class FollowsService {
  constructor(@InjectModel(Follow.name) private followModel: Model<Follow>) {}

  async follow(follower_id: string, followee_id: string): Promise<Follow> {
    if (follower_id === followee_id) {
      throw new BadRequestException('Cannot follow yourself');
    }
    return this.followModel
      .findOneAndUpdate(
        { follower_id, followee_id },
        { $setOnInsert: { follower_id, followee_id } },
        { upsert: true, new: true },
      )
      .exec();
  }

  async unfollow(follower_id: string, followee_id: string): Promise<void> {
    await this.followModel.deleteOne({ follower_id, followee_id }).exec();
  }

  async isFollowing(
    follower_id: string,
    followee_id: string,
  ): Promise<boolean> {
    if (!follower_id || !followee_id) return false;
    const found = await this.followModel.exists({ follower_id, followee_id });
    return !!found;
  }

  async followingSetForUser(
    follower_id: string,
    followee_ids: string[],
  ): Promise<Set<string>> {
    const result = new Set<string>();
    if (!follower_id || followee_ids.length === 0) return result;
    const rows = await this.followModel
      .find({ follower_id, followee_id: { $in: followee_ids } })
      .select({ followee_id: 1 })
      .lean()
      .exec();
    for (const row of rows) result.add(row.followee_id);
    return result;
  }

  async countFollowers(user_id: string): Promise<number> {
    return this.followModel.countDocuments({ followee_id: user_id }).exec();
  }

  async countFollowing(user_id: string): Promise<number> {
    return this.followModel.countDocuments({ follower_id: user_id }).exec();
  }
}
