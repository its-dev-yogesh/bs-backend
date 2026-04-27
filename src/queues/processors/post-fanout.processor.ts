import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  FanoutPostJobData,
  JOB_FANOUT_POST,
  QUEUE_POST_FANOUT,
} from '../queue.constants';
import { Feed } from '../../feeds/schemas/feed.schema';
import { User, UserType } from '../../users/schemas/user.schema';

@Processor(QUEUE_POST_FANOUT)
export class PostFanoutProcessor extends WorkerHost {
  private readonly logger = new Logger(PostFanoutProcessor.name);

  constructor(
    @InjectModel(Feed.name) private readonly feedModel: Model<Feed>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {
    super();
  }

  async process(job: Job<FanoutPostJobData>): Promise<{ inserted: number }> {
    if (job.name !== JOB_FANOUT_POST) {
      return { inserted: 0 };
    }

    const { post_id, author_user_id, post_type } = job.data;

    /*
     * Naive fan-out: insert this post into the feed of every counterparty user.
     * In production this needs targeting + scoring; today it just makes the
     * post discoverable via /feeds without a manual /feeds/regenerate.
     */
    const counterpartyType =
      post_type === 'listing' ? UserType.USER : UserType.AGENT;

    const targetUsers = await this.userModel
      .find({ type: counterpartyType, _id: { $ne: author_user_id } })
      .select({ _id: 1 })
      .lean()
      .exec();

    if (targetUsers.length === 0) {
      this.logger.log(`No counterparty users for post ${post_id}`);
      return { inserted: 0 };
    }

    const ops = targetUsers.map((u) => ({
      updateOne: {
        filter: { user_id: u._id, post_id },
        update: { $setOnInsert: { user_id: u._id, post_id, score: 0 } },
        upsert: true,
      },
    }));

    const result = await this.feedModel.bulkWrite(ops, { ordered: false });
    const inserted = (result.upsertedCount ?? 0) + (result.modifiedCount ?? 0);
    this.logger.log(
      `Fanned out post ${post_id} to ${targetUsers.length} ${counterpartyType}s (${inserted} entries)`,
    );
    return { inserted };
  }
}
