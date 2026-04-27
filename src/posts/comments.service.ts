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

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    @InjectModel(Post.name) private postModel: Model<Post>,
  ) {}

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

  async findByPost(post_id: string): Promise<Comment[]> {
    return this.commentModel.find({ post_id }).sort({ createdAt: 1 }).exec();
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
    if (comment.user_id !== user_id) {
      throw new BadRequestException("Cannot delete another user's comment");
    }
    await this.commentModel.findByIdAndDelete(comment_id).exec();
  }
}
