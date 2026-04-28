import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Model } from 'mongoose';
import {
  Post,
  PostStatus,
  PostType,
  PostVisibility,
} from './schemas/post.schema';
import { PropertyListing } from './schemas/property-listing.schema';
import { PropertyRequirement } from './schemas/property-requirement.schema';
import { PostMedia } from './schemas/post-media.schema';
import {
  BasePostFieldsDto,
  CreateListingPostDto,
  CreateRequirementPostDto,
  UpdatePostDto,
} from './dto/create-post.dto';
import { CreatePostMediaDto } from './dto/create-post-media.dto';
import { UserType } from '../users/schemas/user.schema';
import {
  FanoutPostJobData,
  JOB_FANOUT_POST,
  JOB_PROCESS_MEDIA,
  ProcessMediaJobData,
  QUEUE_MEDIA_PROCESSING,
  QUEUE_POST_FANOUT,
} from '../queues/queue.constants';

export interface PostWithDetails {
  post: Post;
  listing?: PropertyListing | null;
  requirement?: PropertyRequirement | null;
  media: PostMedia[];
}

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(PropertyListing.name)
    private listingModel: Model<PropertyListing>,
    @InjectModel(PropertyRequirement.name)
    private requirementModel: Model<PropertyRequirement>,
    @InjectModel(PostMedia.name) private mediaModel: Model<PostMedia>,
    @InjectQueue(QUEUE_POST_FANOUT)
    private readonly fanoutQueue: Queue<FanoutPostJobData>,
    @InjectQueue(QUEUE_MEDIA_PROCESSING)
    private readonly mediaQueue: Queue<ProcessMediaJobData>,
  ) {}

  async createListing(
    user_id: string,
    user_type: UserType,
    dto: CreateListingPostDto,
  ): Promise<PostWithDetails> {
    if (user_type !== UserType.AGENT) {
      throw new ForbiddenException('Only agents can post listings');
    }

    const post = await this.createBasePost(user_id, PostType.LISTING, dto);
    const listing = await this.listingModel.create({
      post_id: post._id,
      ...dto.listing,
    });

    await this.maybeEnqueueFanout(post);

    return { post, listing, requirement: null, media: [] };
  }

  async createRequirement(
    user_id: string,
    _user_type: UserType,
    dto: CreateRequirementPostDto,
  ): Promise<PostWithDetails> {
    const post = await this.createBasePost(user_id, PostType.REQUIREMENT, dto);
    const requirement = await this.requirementModel.create({
      post_id: post._id,
      ...dto.requirement,
    });

    await this.maybeEnqueueFanout(post);

    return { post, listing: null, requirement, media: [] };
  }

  async publish(id: string, user_id: string): Promise<Post> {
    const post = await this.postModel.findById(id).exec();
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    if (post.user_id !== user_id) {
      throw new ForbiddenException("Cannot publish another user's post");
    }
    if (post.status === PostStatus.ACTIVE) {
      return post;
    }

    const published = await this.postModel
      .findByIdAndUpdate(id, { status: PostStatus.ACTIVE }, { new: true })
      .exec();
    if (!published) {
      throw new NotFoundException('Post not found');
    }

    await this.maybeEnqueueFanout(published);
    return published;
  }

  async findDraftsByUser(user_id: string): Promise<Post[]> {
    return this.postModel
      .find({ user_id, status: PostStatus.DRAFT })
      .sort({ updatedAt: -1 })
      .exec();
  }

  private async maybeEnqueueFanout(post: Post) {
    if (post.status !== PostStatus.ACTIVE) return;
    if (!post._id) return;
    await this.fanoutQueue.add(
      JOB_FANOUT_POST,
      {
        post_id: post._id,
        author_user_id: post.user_id,
        post_type: post.type === PostType.LISTING ? 'listing' : 'requirement',
      },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
        removeOnComplete: 100,
        removeOnFail: 500,
      },
    );
  }

  private createBasePost(
    user_id: string,
    type: PostType,
    fields: BasePostFieldsDto,
  ) {
    return this.postModel.create({
      user_id,
      type,
      title: fields.title,
      description: fields.description,
      location_text: fields.location_text,
      latitude: fields.latitude,
      longitude: fields.longitude,
      visibility: fields.visibility,
      status: fields.status,
    });
  }

  async findById(id: string): Promise<PostWithDetails> {
    const result = await this.findByIdSafe(id);
    if (!result) {
      throw new NotFoundException('Post not found');
    }
    return result;
  }

  async findByIdSafe(id: string): Promise<PostWithDetails | null> {
    const post = await this.postModel.findById(id).exec();
    if (!post) {
      return null;
    }

    const [listing, requirement, media] = await Promise.all([
      post.type === PostType.LISTING
        ? this.listingModel.findOne({ post_id: id }).exec()
        : Promise.resolve(null),
      post.type === PostType.REQUIREMENT
        ? this.requirementModel.findOne({ post_id: id }).exec()
        : Promise.resolve(null),
      this.mediaModel.find({ post_id: id }).sort({ order_index: 1 }).exec(),
    ]);

    return { post, listing, requirement, media };
  }

  async findAll(filter: {
    type?: PostType;
    user_id?: string;
    limit?: number;
    skip?: number;
  }): Promise<Post[]> {
    const query: Record<string, unknown> = {};
    if (filter.type) query.type = filter.type;
    if (filter.user_id) query.user_id = filter.user_id;

    return this.postModel
      .find(query)
      .sort({ createdAt: -1 })
      .skip(filter.skip ?? 0)
      .limit(filter.limit ?? 20)
      .exec();
  }

  async findActiveByType(type: PostType | PostType[]): Promise<Post[]> {
    return this.postModel
      .find({
        type: Array.isArray(type) ? { $in: type } : type,
        status: PostStatus.ACTIVE,
        visibility: PostVisibility.PUBLIC,
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  async update(id: string, user_id: string, dto: UpdatePostDto): Promise<Post> {
    const post = await this.postModel.findById(id).exec();
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    if (post.user_id !== user_id) {
      throw new BadRequestException("Cannot edit another user's post");
    }

    const updated = await this.postModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!updated) {
      throw new NotFoundException('Post not found');
    }
    return updated;
  }

  async remove(id: string, user_id: string): Promise<void> {
    const post = await this.postModel.findById(id).exec();
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    if (post.user_id !== user_id) {
      throw new BadRequestException("Cannot delete another user's post");
    }

    await Promise.all([
      this.postModel.findByIdAndDelete(id).exec(),
      this.listingModel.deleteOne({ post_id: id }).exec(),
      this.requirementModel.deleteOne({ post_id: id }).exec(),
      this.mediaModel.deleteMany({ post_id: id }).exec(),
    ]);
  }

  async addMedia(
    post_id: string,
    user_id: string,
    dto: CreatePostMediaDto,
  ): Promise<PostMedia> {
    const post = await this.postModel.findById(post_id).exec();
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    if (post.user_id !== user_id) {
      throw new BadRequestException("Cannot add media to another user's post");
    }

    const media = await this.mediaModel.create({
      post_id,
      url: dto.url,
      type: dto.type,
      order_index: dto.order_index ?? 0,
    });

    if (media._id) {
      await this.mediaQueue.add(
        JOB_PROCESS_MEDIA,
        {
          media_id: media._id,
          post_id,
          url: media.url,
          type: media.type,
        },
        {
          attempts: 3,
          backoff: { type: 'exponential', delay: 5000 },
          removeOnComplete: 100,
          removeOnFail: 500,
        },
      );
    }

    return media;
  }

  async listMedia(post_id: string): Promise<PostMedia[]> {
    return this.mediaModel.find({ post_id }).sort({ order_index: 1 }).exec();
  }

  async removeMedia(media_id: string, user_id: string): Promise<void> {
    const media = await this.mediaModel.findById(media_id).exec();
    if (!media) {
      throw new NotFoundException('Media not found');
    }
    const post = await this.postModel.findById(media.post_id).exec();
    if (!post || post.user_id !== user_id) {
      throw new BadRequestException(
        "Cannot remove media from another user's post",
      );
    }
    await this.mediaModel.findByIdAndDelete(media_id).exec();
  }
}
