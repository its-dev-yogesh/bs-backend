import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SavedPost } from './schemas/saved-post.schema';
import { Post } from './schemas/post.schema';

@Injectable()
export class SavedPostsService {
  constructor(
    @InjectModel(SavedPost.name) private savedPostModel: Model<SavedPost>,
    @InjectModel(Post.name) private postModel: Model<Post>,
  ) {}

  async save(user_id: string, post_id: string): Promise<SavedPost> {
    const exists = await this.postModel.exists({ _id: post_id });
    if (!exists) {
      throw new NotFoundException('Post not found');
    }
    return this.savedPostModel
      .findOneAndUpdate(
        { user_id, post_id },
        { $setOnInsert: { user_id, post_id } },
        { upsert: true, new: true },
      )
      .exec();
  }

  async unsave(user_id: string, post_id: string): Promise<void> {
    await this.savedPostModel.deleteOne({ user_id, post_id }).exec();
  }

  async listForUser(
    user_id: string,
  ): Promise<Array<{ post: Record<string, unknown> }>> {
    const savedRows = await this.savedPostModel
      .find({ user_id })
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    if (savedRows.length === 0) {
      return [];
    }

    const postIds = savedRows.map((row) => String(row.post_id));
    const posts = await this.postModel
      .find({ _id: { $in: postIds } })
      .lean()
      .exec();

    const byId = new Map(
      posts.map((p) => [String((p as { _id?: unknown })._id), p]),
    );
    const orderedPosts: Record<string, unknown>[] = [];
    for (const id of postIds) {
      const post = byId.get(id);
      if (post) orderedPosts.push(post as unknown as Record<string, unknown>);
    }
    return orderedPosts.map((post) => ({ post }));
  }

  async isSaved(user_id: string, post_id: string): Promise<boolean> {
    const found = await this.savedPostModel.exists({ user_id, post_id });
    return !!found;
  }

  async countByPost(post_id: string): Promise<number> {
    return this.savedPostModel.countDocuments({ post_id }).exec();
  }
}
