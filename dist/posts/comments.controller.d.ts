import { User } from '../users/schemas/user.schema';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
export declare class CommentsController {
    private readonly commentsService;
    constructor(commentsService: CommentsService);
    create(post_id: string, user: User, dto: CreateCommentDto): Promise<import("./schemas/comment.schema").Comment>;
    findByPost(post_id: string): Promise<import("./schemas/comment.schema").Comment[]>;
    findReplies(comment_id: string): Promise<import("./schemas/comment.schema").Comment[]>;
    remove(comment_id: string, user: User): Promise<void>;
}
