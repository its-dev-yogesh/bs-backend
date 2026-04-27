import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import {
  JOB_PROCESS_MEDIA,
  ProcessMediaJobData,
  QUEUE_MEDIA_PROCESSING,
} from '../queue.constants';

@Processor(QUEUE_MEDIA_PROCESSING)
export class MediaProcessingProcessor extends WorkerHost {
  private readonly logger = new Logger(MediaProcessingProcessor.name);

  process(job: Job<ProcessMediaJobData>): Promise<{ ok: boolean }> {
    if (job.name !== JOB_PROCESS_MEDIA) {
      return Promise.resolve({ ok: false });
    }

    /*
     * Real implementation belongs here: virus scan, transcode/resize for
     * thumbnails, push to CDN, write back the variants. For now we just log
     * so the queue plumbing is verifiable end-to-end.
     */
    const { media_id, post_id, url, type } = job.data;
    this.logger.log(
      `Processing ${type} media ${media_id} for post ${post_id}: ${url}`,
    );
    return Promise.resolve({ ok: true });
  }
}
