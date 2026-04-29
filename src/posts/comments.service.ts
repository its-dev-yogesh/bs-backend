import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment } from './schemas/comment.schema';
import { Post } from './schemas/post.schema';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentLike } from './schemas/comment-like.schema';
import { User } from '../users/schemas/user.schema';

export type EnrichedComment = Record<string, unknown> & {
  _id: string;
  post_id: string;
  user_id: string;
  username?: string;
  name?: string;
  parent_id?: string | null;
  content: string;
  createdAt?: Date;
  likes_count: number;
  liked: boolean;
  replies?: EnrichedComment[];
};

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(CommentLike.name)
    private readonly commentLikeModel: Model<CommentLike>,
  ) { }

  async create(
    user_id: string,
    post_id: string,
    dto: CreateCommentDto,
  ): Promise<Comment> {
    const postExists = await this.postModel.exists({ _id: post_id });
    if (!postExists) {
      throw new NotFoundException('Post not found');
    }

    if (dto.parent_id) {
      const parent = await this.commentModel
        .findOne({ _id: dto.parent_id, post_id })
        .exec();
      if (!parent) {
        throw new BadRequestException('parent_id does not exist on this post');
      }
    }

    return this.commentModel.create({
      post_id,
      user_id,
      parent_id: dto.parent_id ?? null,
      content: dto.content,
    });
  }

  async findByPost(
    post_id: string,
    current_user_id?: string,
  ): Promise<EnrichedComment[]> {
    const comments = await this.commentModel
      .find({ post_id })
      .sort({ createdAt: 1 })
      .lean()
      .exec();

    const ids = comments
      .map((c) => c._id)
      .filter((v): v is string => typeof v === 'string');

    const [counts, likedSet] = await Promise.all([
      this.reactionsService.countsByComments(ids),
      current_user_id
        ? this.reactionsService.likedSetForUser(current_user_id, ids)
        : Promise.resolve(new Set<string>()),
    ]);

    return comments.map((c) => ({
      ...(c as Comment),
      like_count: counts.get(c._id ?? '') ?? 0,
      is_liked: likedSet.has(c._id ?? ''),
    }));
  }

  async findByPostThreaded(
    post_id: string,
    currentUserId?: string,
  ): Promise<EnrichedComment[]> {
    const rows = await this.commentModel
      .find({ post_id })
      .sort({ createdAt: 1 })
      .lean()
      .exec();
    if (rows.length === 0) {
      return [];
    }
    const ids = rows.map((r) => String(r._id));
    const userIds = Array.from(new Set(rows.map((r) => String(r.user_id))));
    const users = await this.userModel
      .find({ _id: { $in: userIds } })
      .select('username')
      .lean()
      .exec();
    const usernameById = new Map(
      users.map((u) => [String((u as { _id?: unknown })._id), String((u as { username?: unknown }).username ?? '')]),
    );
    const counts = await this.commentLikeModel
      .aggregate<{ _id: string; n: number }>([
        { $match: { comment_id: { $in: ids } } },
        { $group: { _id: '$comment_id', n: { $sum: 1 } } },
      ])
      .exec();
    const countMap = new Map(counts.map((c) => [c._id, c.n]));
    let likedSet = new Set<string>();
    if (currentUserId) {
      const mine = await this.commentLikeModel
        .find({
          user_id: currentUserId,
          comment_id: { $in: ids },
        })
        .select('comment_id')
        .lean()
        .exec();
      likedSet = new Set(mine.map((m) => String(m.comment_id)));
    }

    const enriched: EnrichedComment[] = rows.map((r) => ({
      ...r,
      _id: String(r._id),
      username: usernameById.get(String(r.user_id)) || undefined,
      likes_count: countMap.get(String(r._id)) ?? 0,
      liked: likedSet.has(String(r._id)),
    }));

    const buildTree = (parentId: string | null): EnrichedComment[] =>
      enriched
        .filter((c) => (c.parent_id ?? null) === parentId)
        .map((c) => ({
          ...c,
          replies: buildTree(c._id),
        }));

    return buildTree(null);
  }

  async likeComment(user_id: string, comment_id: string): Promise<{ liked: boolean; likes_count: number }> {
    const exists = await this.commentModel.findById(comment_id).exec();
    if (!exists) {
      throw new NotFoundException('Comment not found');
    }
    await this.commentLikeModel.findOneAndUpdate(
      { comment_id, user_id },
      { comment_id, user_id },
      { upsert: true, new: true },
    );
    const likes_count = await this.commentLikeModel.countDocuments({ comment_id }).exec();
    return { liked: true, likes_count };
  }

  async unlikeComment(user_id: string, comment_id: string): Promise<{ liked: boolean; likes_count: number }> {
    await this.commentLikeModel.deleteOne({ comment_id, user_id }).exec();
    const likes_count = await this.commentLikeModel.countDocuments({ comment_id }).exec();
    return { liked: false, likes_count };
  }

  async findReplies(parent_id: string): Promise<Comment[]> {
    return this.commentModel.find({ parent_id }).sort({ createdAt: 1 }).exec();
  }

  async countByPost(post_id: string): Promise<number> {
    return this.commentModel.countDocuments({ post_id }).exec();
  }

  async remove(comment_id: string, user_id: string): Promise<void> {
    const comment = await this.commentModel.findById(comment_id).exec();
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.user_id === user_id) {
      await this.commentModel.findByIdAndDelete(comment_id).exec();
      return;
    }

    const post = await this.postModel
      .findById(comment.post_id)
      .select({ user_id: 1 })
      .lean()
      .exec();
    if (post && post.user_id === user_id) {
      await this.commentModel.findByIdAndDelete(comment_id).exec();
      return;
    }

    throw new BadRequestException(
      'Only the comment author or post owner can delete this comment',
    );
  }
}
