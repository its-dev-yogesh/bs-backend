import { User } from '../users/schemas/user.schema';
import { FeedsService } from './feeds.service';
export declare class FeedsController {
    private readonly feedsService;
    constructor(feedsService: FeedsService);
    getFeed(user: User, limit?: string, skip?: string): Promise<import("./feeds.service").FeedItem[]>;
    regenerate(user: User): Promise<{
        generated: number;
    }>;
}
