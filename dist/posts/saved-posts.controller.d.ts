import { User } from '../users/schemas/user.schema';
import { SavedPostsService } from './saved-posts.service';
export declare class SavedPostsController {
    private readonly savedPostsService;
    constructor(savedPostsService: SavedPostsService);
    save(post_id: string, user: User): Promise<import("./schemas/saved-post.schema").SavedPost>;
    unsave(post_id: string, user: User): Promise<void>;
    list(user: User): Promise<import("./schemas/saved-post.schema").SavedPost[]>;
    isSaved(post_id: string, user: User): Promise<{
        saved: boolean;
    }>;
}
