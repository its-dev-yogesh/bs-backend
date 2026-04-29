import { Injectable } from '@nestjs/common';
import { PostsService } from '../posts/posts.service';
import { ReactionsService } from '../posts/reactions.service';
import { CommentsService } from '../posts/comments.service';
import { SavedPostsService } from '../posts/saved-posts.service';
import { FollowsService } from '../follows/follows.service';
import { InquiriesService } from '../inquiries/inquiries.service';

export interface PostInsight {
  post_id: string;
  title: string;
  description?: string;
  createdAt?: Date;
  likes_count: number;
  comments_count: number;
  saves_count: number;
  inquiries_count: number;
}

export interface InsightsSummary {
  posts_count: number;
  followers_count: number;
  following_count: number;
  total_likes: number;
  total_comments: number;
  total_saves: number;
  total_inquiries: number;
}

export interface InsightsResponse {
  summary: InsightsSummary;
  posts: PostInsight[];
}

@Injectable()
export class MeService {
  constructor(
    private readonly postsService: PostsService,
    private readonly reactionsService: ReactionsService,
    private readonly commentsService: CommentsService,
    private readonly savedPostsService: SavedPostsService,
    private readonly followsService: FollowsService,
    private readonly inquiriesService: InquiriesService,
  ) {}

  async getInsights(user_id: string): Promise<InsightsResponse> {
    const posts = await this.postsService.findAll({
      user_id,
      limit: 200,
    });

    const post_ids = posts
      .map((p) => p._id)
      .filter((id): id is string => typeof id === 'string');

    const [perPostStats, followers_count, following_count, inquiryCounts] =
      await Promise.all([
        Promise.all(
          post_ids.map(async (post_id) => {
            const [reactions, comments_count, saves_count] = await Promise.all([
              this.reactionsService.countsByPost(post_id),
              this.commentsService.countByPost(post_id),
              this.savedPostsService.countByPost(post_id),
            ]);
            return {
              post_id,
              likes_count: reactions.like,
              comments_count,
              saves_count,
            };
          }),
        ),
        this.followsService.countFollowers(user_id),
        this.followsService.countFollowing(user_id),
        this.inquiriesService.countsByPosts(post_ids),
      ]);

    const statsByPost = new Map(perPostStats.map((s) => [s.post_id, s]));

    const enrichedPosts: PostInsight[] = posts
      .filter((p): p is typeof p & { _id: string } => typeof p._id === 'string')
      .map((p) => {
        const stats = statsByPost.get(p._id);
        return {
          post_id: p._id,
          title: p.title,
          description: p.description,
          createdAt: p.createdAt,
          likes_count: stats?.likes_count ?? 0,
          comments_count: stats?.comments_count ?? 0,
          saves_count: stats?.saves_count ?? 0,
          inquiries_count: inquiryCounts.get(p._id) ?? 0,
        };
      });

    const summary: InsightsSummary = {
      posts_count: enrichedPosts.length,
      followers_count,
      following_count,
      total_likes: sum(enrichedPosts.map((p) => p.likes_count)),
      total_comments: sum(enrichedPosts.map((p) => p.comments_count)),
      total_saves: sum(enrichedPosts.map((p) => p.saves_count)),
      total_inquiries: sum(enrichedPosts.map((p) => p.inquiries_count)),
    };

    return { summary, posts: enrichedPosts };
  }
}

function sum(values: number[]): number {
  return values.reduce((acc, n) => acc + n, 0);
}
