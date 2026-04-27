import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { ProcessMediaJobData } from '../queue.constants';
export declare class MediaProcessingProcessor extends WorkerHost {
    private readonly logger;
    process(job: Job<ProcessMediaJobData>): Promise<{
        ok: boolean;
    }>;
}
