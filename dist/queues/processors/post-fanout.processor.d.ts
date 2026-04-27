import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Model } from 'mongoose';
import { FanoutPostJobData } from '../queue.constants';
import { Feed } from '../../feeds/schemas/feed.schema';
import { User } from '../../users/schemas/user.schema';
export declare class PostFanoutProcessor extends WorkerHost {
    private readonly feedModel;
    private readonly userModel;
    private readonly logger;
    constructor(feedModel: Model<Feed>, userModel: Model<User>);
    process(job: Job<FanoutPostJobData>): Promise<{
        inserted: number;
    }>;
}
