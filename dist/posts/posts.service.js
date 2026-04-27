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
exports.PostsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const mongoose_2 = require("mongoose");
const post_schema_1 = require("./schemas/post.schema");
const property_listing_schema_1 = require("./schemas/property-listing.schema");
const property_requirement_schema_1 = require("./schemas/property-requirement.schema");
const post_media_schema_1 = require("./schemas/post-media.schema");
const user_schema_1 = require("../users/schemas/user.schema");
const queue_constants_1 = require("../queues/queue.constants");
let PostsService = class PostsService {
    postModel;
    listingModel;
    requirementModel;
    mediaModel;
    fanoutQueue;
    mediaQueue;
    constructor(postModel, listingModel, requirementModel, mediaModel, fanoutQueue, mediaQueue) {
        this.postModel = postModel;
        this.listingModel = listingModel;
        this.requirementModel = requirementModel;
        this.mediaModel = mediaModel;
        this.fanoutQueue = fanoutQueue;
        this.mediaQueue = mediaQueue;
    }
    async createListing(user_id, user_type, dto) {
        if (user_type !== user_schema_1.UserType.AGENT) {
            throw new common_1.ForbiddenException('Only agents can post listings');
        }
        const post = await this.createBasePost(user_id, post_schema_1.PostType.LISTING, dto);
        const listing = await this.listingModel.create({
            post_id: post._id,
            ...dto.listing,
        });
        await this.maybeEnqueueFanout(post);
        return { post, listing, requirement: null, media: [] };
    }
    async createRequirement(user_id, user_type, dto) {
        if (user_type !== user_schema_1.UserType.USER) {
            throw new common_1.ForbiddenException('Only users can post requirements');
        }
        const post = await this.createBasePost(user_id, post_schema_1.PostType.REQUIREMENT, dto);
        const requirement = await this.requirementModel.create({
            post_id: post._id,
            ...dto.requirement,
        });
        await this.maybeEnqueueFanout(post);
        return { post, listing: null, requirement, media: [] };
    }
    async publish(id, user_id) {
        const post = await this.postModel.findById(id).exec();
        if (!post) {
            throw new common_1.NotFoundException('Post not found');
        }
        if (post.user_id !== user_id) {
            throw new common_1.ForbiddenException("Cannot publish another user's post");
        }
        if (post.status === post_schema_1.PostStatus.ACTIVE) {
            return post;
        }
        const published = await this.postModel
            .findByIdAndUpdate(id, { status: post_schema_1.PostStatus.ACTIVE }, { new: true })
            .exec();
        if (!published) {
            throw new common_1.NotFoundException('Post not found');
        }
        await this.maybeEnqueueFanout(published);
        return published;
    }
    async findDraftsByUser(user_id) {
        return this.postModel
            .find({ user_id, status: post_schema_1.PostStatus.DRAFT })
            .sort({ updatedAt: -1 })
            .exec();
    }
    async maybeEnqueueFanout(post) {
        if (post.status !== post_schema_1.PostStatus.ACTIVE)
            return;
        if (!post._id)
            return;
        await this.fanoutQueue.add(queue_constants_1.JOB_FANOUT_POST, {
            post_id: post._id,
            author_user_id: post.user_id,
            post_type: post.type === post_schema_1.PostType.LISTING ? 'listing' : 'requirement',
        }, {
            attempts: 3,
            backoff: { type: 'exponential', delay: 5000 },
            removeOnComplete: 100,
            removeOnFail: 500,
        });
    }
    createBasePost(user_id, type, fields) {
        return this.postModel.create({
            user_id,
            type,
            title: fields.title,
            description: fields.description,
            location_text: fields.location_text,
            latitude: fields.latitude,
            longitude: fields.longitude,
            visibility: fields.visibility,
            status: fields.status,
        });
    }
    async findById(id) {
        const result = await this.findByIdSafe(id);
        if (!result) {
            throw new common_1.NotFoundException('Post not found');
        }
        return result;
    }
    async findByIdSafe(id) {
        const post = await this.postModel.findById(id).exec();
        if (!post) {
            return null;
        }
        const [listing, requirement, media] = await Promise.all([
            post.type === post_schema_1.PostType.LISTING
                ? this.listingModel.findOne({ post_id: id }).exec()
                : Promise.resolve(null),
            post.type === post_schema_1.PostType.REQUIREMENT
                ? this.requirementModel.findOne({ post_id: id }).exec()
                : Promise.resolve(null),
            this.mediaModel.find({ post_id: id }).sort({ order_index: 1 }).exec(),
        ]);
        return { post, listing, requirement, media };
    }
    async findAll(filter) {
        const query = {};
        if (filter.type)
            query.type = filter.type;
        if (filter.user_id)
            query.user_id = filter.user_id;
        return this.postModel
            .find(query)
            .sort({ createdAt: -1 })
            .skip(filter.skip ?? 0)
            .limit(filter.limit ?? 20)
            .exec();
    }
    async findActiveByType(type) {
        return this.postModel
            .find({
            type,
            status: post_schema_1.PostStatus.ACTIVE,
            visibility: post_schema_1.PostVisibility.PUBLIC,
        })
            .sort({ createdAt: -1 })
            .exec();
    }
    async update(id, user_id, dto) {
        const post = await this.postModel.findById(id).exec();
        if (!post) {
            throw new common_1.NotFoundException('Post not found');
        }
        if (post.user_id !== user_id) {
            throw new common_1.BadRequestException("Cannot edit another user's post");
        }
        const updated = await this.postModel
            .findByIdAndUpdate(id, dto, { new: true })
            .exec();
        if (!updated) {
            throw new common_1.NotFoundException('Post not found');
        }
        return updated;
    }
    async remove(id, user_id) {
        const post = await this.postModel.findById(id).exec();
        if (!post) {
            throw new common_1.NotFoundException('Post not found');
        }
        if (post.user_id !== user_id) {
            throw new common_1.BadRequestException("Cannot delete another user's post");
        }
        await Promise.all([
            this.postModel.findByIdAndDelete(id).exec(),
            this.listingModel.deleteOne({ post_id: id }).exec(),
            this.requirementModel.deleteOne({ post_id: id }).exec(),
            this.mediaModel.deleteMany({ post_id: id }).exec(),
        ]);
    }
    async addMedia(post_id, user_id, dto) {
        const post = await this.postModel.findById(post_id).exec();
        if (!post) {
            throw new common_1.NotFoundException('Post not found');
        }
        if (post.user_id !== user_id) {
            throw new common_1.BadRequestException("Cannot add media to another user's post");
        }
        const media = await this.mediaModel.create({
            post_id,
            url: dto.url,
            type: dto.type,
            order_index: dto.order_index ?? 0,
        });
        if (media._id) {
            await this.mediaQueue.add(queue_constants_1.JOB_PROCESS_MEDIA, {
                media_id: media._id,
                post_id,
                url: media.url,
                type: media.type,
            }, {
                attempts: 3,
                backoff: { type: 'exponential', delay: 5000 },
                removeOnComplete: 100,
                removeOnFail: 500,
            });
        }
        return media;
    }
    async listMedia(post_id) {
        return this.mediaModel.find({ post_id }).sort({ order_index: 1 }).exec();
    }
    async removeMedia(media_id, user_id) {
        const media = await this.mediaModel.findById(media_id).exec();
        if (!media) {
            throw new common_1.NotFoundException('Media not found');
        }
        const post = await this.postModel.findById(media.post_id).exec();
        if (!post || post.user_id !== user_id) {
            throw new common_1.BadRequestException("Cannot remove media from another user's post");
        }
        await this.mediaModel.findByIdAndDelete(media_id).exec();
    }
};
exports.PostsService = PostsService;
exports.PostsService = PostsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(post_schema_1.Post.name)),
    __param(1, (0, mongoose_1.InjectModel)(property_listing_schema_1.PropertyListing.name)),
    __param(2, (0, mongoose_1.InjectModel)(property_requirement_schema_1.PropertyRequirement.name)),
    __param(3, (0, mongoose_1.InjectModel)(post_media_schema_1.PostMedia.name)),
    __param(4, (0, bullmq_1.InjectQueue)(queue_constants_1.QUEUE_POST_FANOUT)),
    __param(5, (0, bullmq_1.InjectQueue)(queue_constants_1.QUEUE_MEDIA_PROCESSING)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        bullmq_2.Queue,
        bullmq_2.Queue])
], PostsService);
//# sourceMappingURL=posts.service.js.map