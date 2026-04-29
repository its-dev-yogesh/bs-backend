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
  private readonly maxPostsPerDay = 20;
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
    await this.enforceDailyPostLimit(user_id);
    await this.checkDuplicateListing(dto);

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
    await this.enforceDailyPostLimit(user_id);
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
      whatsapp_number: fields.whatsapp_number,
      latitude: fields.latitude,
      longitude: fields.longitude,
      visibility: fields.visibility,
      status: fields.status,
    });
  }

  private async enforceDailyPostLimit(user_id: string) {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const count = await this.postModel
      .countDocuments({ user_id, createdAt: { $gte: since } })
      .exec();
    if (count >= this.maxPostsPerDay) {
      throw new BadRequestException('Daily posting limit reached');
    }
  }

  private async checkDuplicateListing(dto: CreateListingPostDto) {
    const recentPosts = await this.postModel
      .find({
        type: PostType.LISTING,
        title: dto.title,
        location_text: dto.location_text,
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      })
      .select('_id')
      .limit(5)
      .exec();
    if (!recentPosts.length) return;

    const postIds = recentPosts.map((p) => p._id).filter(Boolean) as string[];
    const existingSamePrice = await this.listingModel
      .findOne({
        post_id: { $in: postIds },
        price: dto.listing.price,
      })
      .exec();
    if (existingSamePrice) {
      throw new BadRequestException(
        'Potential duplicate listing detected; please review your details',
      );
    }
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

  async updateListingDetails(
    postId: string,
    userId: string,
    dto: Partial<PropertyListing>,
  ) {
    const post = await this.postModel.findById(postId).exec();
    if (!post || post.user_id !== userId) {
      throw new BadRequestException("Cannot update another user's listing");
    }
    if (post.type !== PostType.LISTING) {
      throw new BadRequestException('Post is not a listing');
    }
    await this.listingModel.updateOne({ post_id: postId }, { $set: dto }).exec();
    return this.findById(postId);
  }

  async updateRequirementDetails(
    postId: string,
    userId: string,
    dto: Partial<PropertyRequirement>,
  ) {
    const post = await this.postModel.findById(postId).exec();
    if (!post || post.user_id !== userId) {
      throw new BadRequestException("Cannot update another user's requirement");
    }
    if (post.type !== PostType.REQUIREMENT) {
      throw new BadRequestException('Post is not a requirement');
    }
    await this.requirementModel
      .updateOne({ post_id: postId }, { $set: dto })
      .exec();
    return this.findById(postId);
  }

  async findAll(filter: {
    type?: PostType;
    user_id?: string;
    limit?: number;
    skip?: number;
    status?: PostStatus;
  }): Promise<
    Array<Record<string, unknown> & { _id: string; media_urls: string[] }>
  > {
    const query: Record<string, unknown> = {};
    if (filter.type) query.type = filter.type;
    if (filter.user_id) query.user_id = filter.user_id;
    if (filter.status !== undefined) query.status = filter.status;

    const posts = await this.postModel
      .find(query)
      .sort({ createdAt: -1 })
      .skip(filter.skip ?? 0)
      .limit(filter.limit ?? 20)
      .lean()
      .exec();

    if (posts.length === 0) {
      return [];
    }

    const postIds = posts.map((p) => String(p._id));
    const mediaDocs = await this.mediaModel
      .find({ post_id: { $in: postIds } })
      .sort({ post_id: 1, order_index: 1 })
      .lean()
      .exec();

    const urlsByPost = new Map<string, string[]>();
    for (const m of mediaDocs) {
      const pid = String(m.post_id);
      const list = urlsByPost.get(pid) ?? [];
      list.push(m.url);
      urlsByPost.set(pid, list);
    }

    return posts.map((p) => ({
      ...p,
      _id: String(p._id),
      media_urls: urlsByPost.get(String(p._id)) ?? [],
    })) as Array<
      Record<string, unknown> & { _id: string; media_urls: string[] }
    >;
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
