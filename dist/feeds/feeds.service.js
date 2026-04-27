"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const feed_schema_1 = require("./schemas/feed.schema");
const posts_service_1 = require("../posts/posts.service");
const reactions_service_1 = require("../posts/reactions.service");
const comments_service_1 = require("../posts/comments.service");
const saved_posts_service_1 = require("../posts/saved-posts.service");
const post_schema_1 = require("../posts/schemas/post.schema");
const user_schema_1 = require("../users/schemas/user.schema");
let FeedsService = class FeedsService {
    feedModel;
    postsService;
    reactionsService;
    commentsService;
    savedPostsService;
    constructor(feedModel, postsService, reactionsService, commentsService, savedPostsService) {
        this.feedModel = feedModel;
        this.postsService = postsService;
        this.reactionsService = reactionsService;
        this.commentsService = commentsService;
        this.savedPostsService = savedPostsService;
    }
    async getFeed(user_id, opts = {}) {
        const limit = opts.limit ?? 20;
        const skip = opts.skip ?? 0;
        const entries = await this.feedModel
            .find({ user_id })
            .sort({ score: -1, createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .exec();
        const items = await Promise.all(entries.map((entry) => this.buildItem(entry.post_id, entry.score)));
        return items.filter((item) => item !== null);
    }
    async regenerate(user_id, user_type) {
        const targetType = user_type === user_schema_1.UserType.AGENT ? post_schema_1.PostType.REQUIREMENT : post_schema_1.PostType.LISTING;
        const posts = await this.postsService.findActiveByType(targetType);
        await this.feedModel.deleteMany({ user_id }).exec();
        if (posts.length === 0) {
            return { generated: 0 };
        }
        await this.feedModel.insertMany(posts.map((post) => ({
            user_id,
            post_id: post._id,
            score: 0,
        })));
        return { generated: posts.length };
    }
    async buildItem(post_id, score) {
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
};
exports.FeedsService = FeedsService;
exports.FeedsService = FeedsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(feed_schema_1.Feed.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        posts_service_1.PostsService,
        reactions_service_1.ReactionsService,
        comments_service_1.CommentsService,
        saved_posts_service_1.SavedPostsService])
], FeedsService);
//# sourceMappingURL=feeds.service.js.map