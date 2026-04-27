import { Model } from 'mongoose';
import { Comment } from './schemas/comment.schema';
import { Post } from './schemas/post.schema';
import { CreateCommentDto } from './dto/create-comment.dto';
export declare class CommentsService {
    private commentModel;
    private postModel;
    constructor(commentModel: Model<Comment>, postModel: Model<Post>);
    create(user_id: string, post_id: string, dto: CreateCommentDto): Promise<Comment>;
    findByPost(post_id: string): Promise<Comment[]>;
    findReplies(parent_id: string): Promise<Comment[]>;
    countByPost(post_id: string): Promise<number>;
    remove(comment_id: string, user_id: string): Promise<void>;
}
