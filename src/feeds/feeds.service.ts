import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Feed } from './schemas/feed.schema';
import { PostsService } from '../posts/posts.service';
import { ReactionsService } from '../posts/reactions.service';
import { CommentsService } from '../posts/comments.service';
import { SavedPostsService } from '../posts/saved-posts.service';
import { Post, PostType } from '../posts/schemas/post.schema';
import { PropertyListing } from '../posts/schemas/property-listing.schema';
import { PropertyRequirement } from '../posts/schemas/property-requirement.schema';
import { PostMedia } from '../posts/schemas/post-media.schema';
import { UserType } from '../users/schemas/user.schema';

export interface FeedItem {
  post_id: string;
  score: number;
  post: Post;
  listing: PropertyListing | null;
  requirement: PropertyRequirement | null;
  media: PostMedia[];
  likes_count: number;
  comments_count: number;
  saves_count: number;
  inquiries_count: number;
}

@Injectable()
export class FeedsService {
  constructor(
    @InjectModel(Feed.name) private readonly feedModel: Model<Feed>,
    private readonly postsService: PostsService,
    private readonly reactionsService: ReactionsService,
    private readonly commentsService: CommentsService,
    private readonly savedPostsService: SavedPostsService,
  ) {}

  async getFeed(
    user_id: string,
    opts: { limit?: number; skip?: number } = {},
  ): Promise<FeedItem[]> {
    const limit = opts.limit ?? 20;
    const skip = opts.skip ?? 0;

    const entries = await this.feedModel
      .find({ user_id })
      .sort({ score: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    const items = await Promise.all(
      entries.map((entry) => this.buildItem(entry.post_id, entry.score)),
    );

    return items.filter((item): item is FeedItem => item !== null);
  }

  /**
   * Rebuild this user's feed: drop existing entries and seed with all currently
   * active posts of the role-relevant type at score 0. Replace with real
   * scoring once that logic is decided.
   */
  async regenerate(
    user_id: string,
    user_type: UserType,
  ): Promise<{ generated: number }> {
    const targetType =
      user_type === UserType.AGENT ? PostType.REQUIREMENT : PostType.LISTING;

    const posts = await this.postsService.findActiveByType(targetType);

    await this.feedModel.deleteMany({ user_id }).exec();

    if (posts.length === 0) {
      return { generated: 0 };
    }

    await this.feedModel.insertMany(
      posts.map((post) => ({
        user_id,
        post_id: post._id,
        score: 0,
      })),
    );

    return { generated: posts.length };
  }

  private async buildItem(
    post_id: string,
    score: number,
  ): Promise<FeedItem | null> {
    const details = await this.postsService.findByIdSafe(post_id);
    if (!details) {
      return null;
    }

    const [reactionCounts, comments_count, saves_count] = await Promise.all([
      this.reactionsService.countsByPost(post_id),
      this.commentsService.countByPost(post_id),
      this.savedPostsService.countByPost(post_id),
    ]);

    return {
      post_id,
      score,
      post: details.post,
      listing: details.listing ?? null,
      requirement: details.requirement ?? null,
      media: details.media,
      likes_count: reactionCounts.like,
      comments_count,
      saves_count,
      inquiries_count: 0,
    };
  }
}
