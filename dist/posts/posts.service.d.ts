import { Queue } from 'bullmq';
import { Model } from 'mongoose';
import { Post, PostType } from './schemas/post.schema';
import { PropertyListing } from './schemas/property-listing.schema';
import { PropertyRequirement } from './schemas/property-requirement.schema';
import { PostMedia } from './schemas/post-media.schema';
import { CreateListingPostDto, CreateRequirementPostDto, UpdatePostDto } from './dto/create-post.dto';
import { CreatePostMediaDto } from './dto/create-post-media.dto';
import { UserType } from '../users/schemas/user.schema';
import { FanoutPostJobData, ProcessMediaJobData } from '../queues/queue.constants';
export interface PostWithDetails {
    post: Post;
    listing?: PropertyListing | null;
    requirement?: PropertyRequirement | null;
    media: PostMedia[];
}
export declare class PostsService {
    private postModel;
    private listingModel;
    private requirementModel;
    private mediaModel;
    private readonly fanoutQueue;
    private readonly mediaQueue;
    constructor(postModel: Model<Post>, listingModel: Model<PropertyListing>, requirementModel: Model<PropertyRequirement>, mediaModel: Model<PostMedia>, fanoutQueue: Queue<FanoutPostJobData>, mediaQueue: Queue<ProcessMediaJobData>);
    createListing(user_id: string, user_type: UserType, dto: CreateListingPostDto): Promise<PostWithDetails>;
    createRequirement(user_id: string, user_type: UserType, dto: CreateRequirementPostDto): Promise<PostWithDetails>;
    publish(id: string, user_id: string): Promise<Post>;
    findDraftsByUser(user_id: string): Promise<Post[]>;
    private maybeEnqueueFanout;
    private createBasePost;
    findById(id: string): Promise<PostWithDetails>;
    findByIdSafe(id: string): Promise<PostWithDetails | null>;
    findAll(filter: {
        type?: PostType;
        user_id?: string;
        limit?: number;
        skip?: number;
    }): Promise<Post[]>;
    findActiveByType(type: PostType): Promise<Post[]>;
    update(id: string, user_id: string, dto: UpdatePostDto): Promise<Post>;
    remove(id: string, user_id: string): Promise<void>;
    addMedia(post_id: string, user_id: string, dto: CreatePostMediaDto): Promise<PostMedia>;
    listMedia(post_id: string): Promise<PostMedia[]>;
    removeMedia(media_id: string, user_id: string): Promise<void>;
}
