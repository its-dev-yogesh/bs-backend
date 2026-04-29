import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reaction, ReactionType } from './schemas/reaction.schema';
import { Post } from './schemas/post.schema';

export interface ReactionCounts {
  like: number;
  interested: number;
}

@Injectable()
export class ReactionsService {
  constructor(
    @InjectModel(Reaction.name) private reactionModel: Model<Reaction>,
    @InjectModel(Post.name) private postModel: Model<Post>,
  ) {}

  /**
   * Upsert a reaction for (user_id, post_id). The unique index enforces
   * one reaction per user per post — calling with a different type updates
   * the existing reaction.
   */
  async upsert(
    user_id: string,
    post_id: string,
    type: ReactionType,
  ): Promise<Reaction> {
    const post = await this.postModel.exists({ _id: post_id });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const updated = await this.reactionModel
      .findOneAndUpdate(
        { user_id, post_id },
        { $set: { type }, $setOnInsert: { user_id, post_id } },
        { upsert: true, new: true },
      )
      .exec();
    return updated;
  }

  async remove(user_id: string, post_id: string): Promise<void> {
    await this.reactionModel.deleteOne({ user_id, post_id }).exec();
  }

  /** Current user's reaction type on this post, if any. */
  async getUserReactionType(
    user_id: string,
    post_id: string,
  ): Promise<ReactionType | null> {
    const doc = await this.reactionModel
      .findOne({ user_id, post_id })
      .select('type')
      .lean()
      .exec();
    return doc?.type ?? null;
  }

  async findByPost(post_id: string): Promise<Reaction[]> {
    return this.reactionModel.find({ post_id }).sort({ createdAt: -1 }).exec();
  }

  async countsByPost(post_id: string): Promise<ReactionCounts> {
    const results = await this.reactionModel
      .aggregate<{
        _id: ReactionType;
        count: number;
      }>([
        { $match: { post_id } },
        { $group: { _id: '$type', count: { $sum: 1 } } },
      ])
      .exec();

    const counts: ReactionCounts = { like: 0, interested: 0 };
    for (const row of results) {
      if (row._id === ReactionType.LIKE) counts.like = row.count;
      if (row._id === ReactionType.INTERESTED) counts.interested = row.count;
    }
    return counts;
  }
}
