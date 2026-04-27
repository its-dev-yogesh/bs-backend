import { Model } from 'mongoose';
import { Reaction, ReactionType } from './schemas/reaction.schema';
import { Post } from './schemas/post.schema';
export interface ReactionCounts {
    like: number;
    interested: number;
}
export declare class ReactionsService {
    private reactionModel;
    private postModel;
    constructor(reactionModel: Model<Reaction>, postModel: Model<Post>);
    upsert(user_id: string, post_id: string, type: ReactionType): Promise<Reaction>;
    remove(user_id: string, post_id: string): Promise<void>;
    findByPost(post_id: string): Promise<Reaction[]>;
    countsByPost(post_id: string): Promise<ReactionCounts>;
}
