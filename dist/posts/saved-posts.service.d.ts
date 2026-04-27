import { Model } from 'mongoose';
import { SavedPost } from './schemas/saved-post.schema';
import { Post } from './schemas/post.schema';
export declare class SavedPostsService {
    private savedPostModel;
    private postModel;
    constructor(savedPostModel: Model<SavedPost>, postModel: Model<Post>);
    save(user_id: string, post_id: string): Promise<SavedPost>;
    unsave(user_id: string, post_id: string): Promise<void>;
    listForUser(user_id: string): Promise<SavedPost[]>;
    isSaved(user_id: string, post_id: string): Promise<boolean>;
    countByPost(post_id: string): Promise<number>;
}
