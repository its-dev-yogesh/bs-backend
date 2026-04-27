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

  async listForUser(user_id: string): Promise<SavedPost[]> {
    return this.savedPostModel.find({ user_id }).sort({ createdAt: -1 }).exec();
  }

  async isSaved(user_id: string, post_id: string): Promise<boolean> {
    const found = await this.savedPostModel.exists({ user_id, post_id });
    return !!found;
  }

  async countByPost(post_id: string): Promise<number> {
    return this.savedPostModel.countDocuments({ post_id }).exec();
  }
}
