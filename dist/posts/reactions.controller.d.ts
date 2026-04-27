import { User } from '../users/schemas/user.schema';
import { ReactionsService } from './reactions.service';
import { CreateReactionDto } from './dto/create-reaction.dto';
export declare class ReactionsController {
    private readonly reactionsService;
    constructor(reactionsService: ReactionsService);
    upsert(post_id: string, user: User, dto: CreateReactionDto): Promise<import("./schemas/reaction.schema").Reaction>;
    remove(post_id: string, user: User): Promise<void>;
    findByPost(post_id: string): Promise<import("./schemas/reaction.schema").Reaction[]>;
    counts(post_id: string): Promise<import("./reactions.service").ReactionCounts>;
}
