import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CommentReaction,
  CommentReactionType,
} from './schemas/comment-reaction.schema';
import { Comment } from './schemas/comment.schema';

@Injectable()
export class CommentReactionsService {
  constructor(
    @InjectModel(CommentReaction.name)
    private reactionModel: Model<CommentReaction>,
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
  ) {}

  async like(user_id: string, comment_id: string): Promise<CommentReaction> {
    const exists = await this.commentModel.exists({ _id: comment_id });
    if (!exists) {
      throw new NotFoundException('Comment not found');
    }
    return this.reactionModel
      .findOneAndUpdate(
        { user_id, comment_id },
        {
          $set: { type: CommentReactionType.LIKE },
          $setOnInsert: { user_id, comment_id },
        },
        { upsert: true, new: true },
      )
      .exec();
  }

  async unlike(user_id: string, comment_id: string): Promise<void> {
    await this.reactionModel.deleteOne({ user_id, comment_id }).exec();
  }

  async countsByComments(comment_ids: string[]): Promise<Map<string, number>> {
    const result = new Map<string, number>();
    if (comment_ids.length === 0) return result;
    const rows = await this.reactionModel
      .aggregate<{
        _id: string;
        count: number;
      }>([
        { $match: { comment_id: { $in: comment_ids } } },
        { $group: { _id: '$comment_id', count: { $sum: 1 } } },
      ])
      .exec();
    for (const row of rows) result.set(row._id, row.count);
    return result;
  }

  async likedSetForUser(
    user_id: string,
    comment_ids: string[],
  ): Promise<Set<string>> {
    const result = new Set<string>();
    if (!user_id || comment_ids.length === 0) return result;
    const rows = await this.reactionModel
      .find({ user_id, comment_id: { $in: comment_ids } })
      .select({ comment_id: 1 })
      .lean()
      .exec();
    for (const row of rows) result.add(row.comment_id);
    return result;
  }
}
