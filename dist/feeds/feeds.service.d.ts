import { Model } from 'mongoose';
import { Feed } from './schemas/feed.schema';
import { PostsService } from '../posts/posts.service';
import { ReactionsService } from '../posts/reactions.service';
import { CommentsService } from '../posts/comments.service';
import { SavedPostsService } from '../posts/saved-posts.service';
import { Post } from '../posts/schemas/post.schema';
import { PropertyListing } from '../posts/schemas/property-listing.schema';
import { PropertyRequirement } from '../posts/schemas/property-requirement.schema';
import { PostMedia } from '../posts/schemas/post-media.schema';
import { UserType } from '../users/schemas/user.schema';
export interface FeedItem {
    post_id: string;
    score: number;
    post: Post;
    listing: PropertyListing | null;
    requirement: PropertyRequirement | null;
    media: PostMedia[];
    likes_count: number;
    comments_count: number;
    saves_count: number;
    inquiries_count: number;
}
export declare class FeedsService {
    private readonly feedModel;
    private readonly postsService;
    private readonly reactionsService;
    private readonly commentsService;
    private readonly savedPostsService;
    constructor(feedModel: Model<Feed>, postsService: PostsService, reactionsService: ReactionsService, commentsService: CommentsService, savedPostsService: SavedPostsService);
    getFeed(user_id: string, opts?: {
        limit?: number;
        skip?: number;
    }): Promise<FeedItem[]>;
    regenerate(user_id: string, user_type: UserType): Promise<{
        generated: number;
    }>;
    private buildItem;
}
