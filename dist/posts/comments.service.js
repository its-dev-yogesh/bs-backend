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
exports.CommentsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const comment_schema_1 = require("./schemas/comment.schema");
const post_schema_1 = require("./schemas/post.schema");
let CommentsService = class CommentsService {
    commentModel;
    postModel;
    constructor(commentModel, postModel) {
        this.commentModel = commentModel;
        this.postModel = postModel;
    }
    async create(user_id, post_id, dto) {
        const postExists = await this.postModel.exists({ _id: post_id });
        if (!postExists) {
            throw new common_1.NotFoundException('Post not found');
        }
        if (dto.parent_id) {
            const parent = await this.commentModel
                .findOne({ _id: dto.parent_id, post_id })
                .exec();
            if (!parent) {
                throw new common_1.BadRequestException('parent_id does not exist on this post');
            }
        }
        return this.commentModel.create({
            post_id,
            user_id,
            parent_id: dto.parent_id ?? null,
            content: dto.content,
        });
    }
    async findByPost(post_id) {
        return this.commentModel.find({ post_id }).sort({ createdAt: 1 }).exec();
    }
    async findReplies(parent_id) {
        return this.commentModel.find({ parent_id }).sort({ createdAt: 1 }).exec();
    }
    async countByPost(post_id) {
        return this.commentModel.countDocuments({ post_id }).exec();
    }
    async remove(comment_id, user_id) {
        const comment = await this.commentModel.findById(comment_id).exec();
        if (!comment) {
            throw new common_1.NotFoundException('Comment not found');
        }
        if (comment.user_id !== user_id) {
            throw new common_1.BadRequestException("Cannot delete another user's comment");
        }
        await this.commentModel.findByIdAndDelete(comment_id).exec();
    }
};
exports.CommentsService = CommentsService;
exports.CommentsService = CommentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(comment_schema_1.Comment.name)),
    __param(1, (0, mongoose_1.InjectModel)(post_schema_1.Post.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], CommentsService);
//# sourceMappingURL=comments.service.js.map