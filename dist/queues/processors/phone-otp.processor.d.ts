import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { SendOtpSmsJobData } from '../queue.constants';
export declare class PhoneOtpProcessor extends WorkerHost {
    private readonly logger;
    process(job: Job<SendOtpSmsJobData>): Promise<{
        delivered: boolean;
    }>;
}
