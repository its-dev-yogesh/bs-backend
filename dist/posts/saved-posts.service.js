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
exports.SavedPostsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const saved_post_schema_1 = require("./schemas/saved-post.schema");
const post_schema_1 = require("./schemas/post.schema");
let SavedPostsService = class SavedPostsService {
    savedPostModel;
    postModel;
    constructor(savedPostModel, postModel) {
        this.savedPostModel = savedPostModel;
        this.postModel = postModel;
    }
    async save(user_id, post_id) {
        const exists = await this.postModel.exists({ _id: post_id });
        if (!exists) {
            throw new common_1.NotFoundException('Post not found');
        }
        return this.savedPostModel
            .findOneAndUpdate({ user_id, post_id }, { $setOnInsert: { user_id, post_id } }, { upsert: true, new: true })
            .exec();
    }
    async unsave(user_id, post_id) {
        await this.savedPostModel.deleteOne({ user_id, post_id }).exec();
    }
    async listForUser(user_id) {
        return this.savedPostModel.find({ user_id }).sort({ createdAt: -1 }).exec();
    }
    async isSaved(user_id, post_id) {
        const found = await this.savedPostModel.exists({ user_id, post_id });
        return !!found;
    }
    async countByPost(post_id) {
        return this.savedPostModel.countDocuments({ post_id }).exec();
    }
};
exports.SavedPostsService = SavedPostsService;
exports.SavedPostsService = SavedPostsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(saved_post_schema_1.SavedPost.name)),
    __param(1, (0, mongoose_1.InjectModel)(post_schema_1.Post.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], SavedPostsService);
//# sourceMappingURL=saved-posts.service.js.map