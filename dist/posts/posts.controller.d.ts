import { User } from '../users/schemas/user.schema';
import { PostsService } from './posts.service';
import { CreateListingPostDto, CreateRequirementPostDto, UpdatePostDto } from './dto/create-post.dto';
import { CreatePostMediaDto } from './dto/create-post-media.dto';
import { PostType } from './schemas/post.schema';
export declare class PostsController {
    private readonly postsService;
    constructor(postsService: PostsService);
    createListing(user: User, dto: CreateListingPostDto): Promise<import("./posts.service").PostWithDetails>;
    createRequirement(user: User, dto: CreateRequirementPostDto): Promise<import("./posts.service").PostWithDetails>;
    findAll(type?: PostType, user_id?: string, limit?: string, skip?: string): Promise<import("./schemas/post.schema").Post[]>;
    findById(id: string): Promise<import("./posts.service").PostWithDetails>;
    update(id: string, user: User, dto: UpdatePostDto): Promise<import("./schemas/post.schema").Post>;
    publish(id: string, user: User): Promise<import("./schemas/post.schema").Post>;
    myDrafts(user: User): Promise<import("./schemas/post.schema").Post[]>;
    remove(id: string, user: User): Promise<void>;
    addMedia(id: string, user: User, dto: CreatePostMediaDto): Promise<import("./schemas/post-media.schema").PostMedia>;
    listMedia(id: string): Promise<import("./schemas/post-media.schema").PostMedia[]>;
    removeMedia(media_id: string, user: User): Promise<void>;
}
