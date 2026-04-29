import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Feed } from './schemas/feed.schema';
import { PostsService } from '../posts/posts.service';
import { ReactionsService } from '../posts/reactions.service';
import { CommentsService } from '../posts/comments.service';
import { SavedPostsService } from '../posts/saved-posts.service';
import { FollowsService } from '../follows/follows.service';
import { InquiriesService } from '../inquiries/inquiries.service';
import { UsersService } from '../users/users.service';
import { UserProfileService } from '../users/user-profile.service';
import { Post, PostType } from '../posts/schemas/post.schema';
import { PropertyListing } from '../posts/schemas/property-listing.schema';
import { PropertyRequirement } from '../posts/schemas/property-requirement.schema';
import { PostMedia } from '../posts/schemas/post-media.schema';
import { ReactionType } from '../posts/schemas/reaction.schema';
import { UserType } from '../users/schemas/user.schema';

export interface FeedItemAuthor {
  user_id: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
  type?: UserType;
}

export interface FeedItem {
  post_id: string;
  score: number;
  post: Post;
  listing: PropertyListing | null;
  requirement: PropertyRequirement | null;
  media: PostMedia[];
  author: FeedItemAuthor | null;
  likes_count: number;
  comments_count: number;
  saves_count: number;
  inquiries_count: number;
  user_reaction: ReactionType | null;
  is_saved: boolean;
  is_following_author: boolean;
  is_inquired: boolean;
}

@Injectable()
export class FeedsService {
  constructor(
    @InjectModel(Feed.name) private readonly feedModel: Model<Feed>,
    private readonly postsService: PostsService,
    private readonly reactionsService: ReactionsService,
    private readonly commentsService: CommentsService,
    private readonly savedPostsService: SavedPostsService,
    private readonly followsService: FollowsService,
    private readonly inquiriesService: InquiriesService,
    private readonly usersService: UsersService,
    private readonly userProfileService: UserProfileService,
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

    const built = await Promise.all(
      entries.map((entry) => this.buildItem(entry.post_id, entry.score)),
    );

    const items = built.filter((item): item is FeedItem => item !== null);

    if (items.length === 0) return items;

    const postIds = items.map((i) => i.post_id);
    const authorIds = Array.from(
      new Set(items.map((i) => i.post.user_id).filter(Boolean)),
    );

    const [
      authorsById,
      profilesByUserId,
      reactionsByPost,
      savedSet,
      followingSet,
      inquiredSet,
      inquiryCounts,
    ] = await Promise.all([
      this.loadAuthors(authorIds),
      this.loadProfiles(authorIds),
      this.reactionsService.findUserReactionsForPosts(user_id, postIds),
      this.savedPostsService.savedSetForUser(user_id, postIds),
      this.followsService.followingSetForUser(user_id, authorIds),
      this.inquiriesService.inquiredSetForUser(user_id, postIds),
      this.inquiriesService.countsByPosts(postIds),
    ]);

    return items.map((item) => {
      const authorId = item.post.user_id;
      const author = authorsById.get(authorId);
      const profile = profilesByUserId.get(authorId);
      const feedAuthor: FeedItemAuthor | null = author
        ? {
            user_id: authorId,
            username: author.username,
            full_name: profile?.full_name,
            avatar_url: profile?.avatar_url,
            type: author.type,
          }
        : null;

      return {
        ...item,
        author: feedAuthor,
        user_reaction: reactionsByPost.get(item.post_id) ?? null,
        is_saved: savedSet.has(item.post_id),
        is_following_author: followingSet.has(authorId),
        is_inquired: inquiredSet.has(item.post_id),
        inquiries_count: inquiryCounts.get(item.post_id) ?? 0,
      };
    });
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
    const targetTypes: PostType | PostType[] =
      user_type === UserType.AGENT
        ? [PostType.REQUIREMENT, PostType.LISTING]
        : PostType.LISTING;

    const posts = await this.postsService.findActiveByType(targetTypes);

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
      author: null,
      likes_count: reactionCounts.like,
      comments_count,
      saves_count,
      inquiries_count: 0,
      user_reaction: null,
      is_saved: false,
      is_following_author: false,
      is_inquired: false,
    };
  }

  private async loadAuthors(authorIds: string[]) {
    const map = new Map<
      string,
      { _id: string; username: string; type?: UserType }
    >();
    if (authorIds.length === 0) return map;
    const users = await Promise.all(
      authorIds.map((id) => this.usersService.findById(id)),
    );
    for (const u of users) {
      const id = u?._id ?? u?.id;
      if (u && id) {
        map.set(id, { _id: id, username: u.username, type: u.type });
      }
    }
    return map;
  }

  private async loadProfiles(authorIds: string[]) {
    const map = new Map<string, { full_name?: string; avatar_url?: string }>();
    if (authorIds.length === 0) return map;
    const profiles = await Promise.all(
      authorIds.map((id) => this.userProfileService.findByUserId(id)),
    );
    for (const p of profiles) {
      if (p?.user_id) {
        map.set(p.user_id, {
          full_name: p.full_name,
          avatar_url: p.avatar_url,
        });
      }
    }
    return map;
  }
}
