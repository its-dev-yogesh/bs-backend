import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Inquiry, InquiryStatus } from './schemas/inquiry.schema';
import { Post } from '../posts/schemas/post.schema';
import { CreateInquiryDto } from './dto/create-inquiry.dto';

@Injectable()
export class InquiriesService {
  constructor(
    @InjectModel(Inquiry.name) private inquiryModel: Model<Inquiry>,
    @InjectModel(Post.name) private postModel: Model<Post>,
  ) {}

  async create(
    user_id: string,
    post_id: string,
    dto: CreateInquiryDto,
  ): Promise<Inquiry> {
    const post = await this.postModel
      .findById(post_id)
      .select({ user_id: 1 })
      .lean()
      .exec();
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    if (post.user_id === user_id) {
      throw new BadRequestException('Cannot inquire about your own post');
    }

    return this.inquiryModel
      .findOneAndUpdate(
        { post_id, user_id },
        {
          $setOnInsert: {
            post_id,
            user_id,
            post_owner_id: post.user_id,
            status: InquiryStatus.NEW,
          },
          ...(dto.message ? { $set: { message: dto.message } } : {}),
        },
        { upsert: true, new: true },
      )
      .exec();
  }

  async remove(user_id: string, post_id: string): Promise<void> {
    await this.inquiryModel.deleteOne({ user_id, post_id }).exec();
  }

  async hasInquired(user_id: string, post_id: string): Promise<boolean> {
    if (!user_id) return false;
    const found = await this.inquiryModel.exists({ user_id, post_id });
    return !!found;
  }

  async inquiredSetForUser(
    user_id: string,
    post_ids: string[],
  ): Promise<Set<string>> {
    const result = new Set<string>();
    if (!user_id || post_ids.length === 0) return result;
    const rows = await this.inquiryModel
      .find({ user_id, post_id: { $in: post_ids } })
      .select({ post_id: 1 })
      .lean()
      .exec();
    for (const row of rows) result.add(row.post_id);
    return result;
  }

  async countsByPosts(post_ids: string[]): Promise<Map<string, number>> {
    const result = new Map<string, number>();
    if (post_ids.length === 0) return result;
    const rows = await this.inquiryModel
      .aggregate<{
        _id: string;
        count: number;
      }>([
        { $match: { post_id: { $in: post_ids } } },
        { $group: { _id: '$post_id', count: { $sum: 1 } } },
      ])
      .exec();
    for (const row of rows) result.set(row._id, row.count);
    return result;
  }

  async listForPost(
    post_owner_id: string,
    post_id: string,
  ): Promise<Inquiry[]> {
    const post = await this.postModel
      .findById(post_id)
      .select({ user_id: 1 })
      .lean()
      .exec();
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    if (post.user_id !== post_owner_id) {
      throw new BadRequestException('Only the post owner can view inquiries');
    }
    return this.inquiryModel.find({ post_id }).sort({ createdAt: -1 }).exec();
  }

  async listSentByUser(user_id: string): Promise<Inquiry[]> {
    return this.inquiryModel.find({ user_id }).sort({ createdAt: -1 }).exec();
  }

  async listReceivedByUser(post_owner_id: string): Promise<Inquiry[]> {
    return this.inquiryModel
      .find({ post_owner_id })
      .sort({ createdAt: -1 })
      .exec();
  }
}
