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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostSchema = exports.Post = exports.PostStatus = exports.PostVisibility = exports.PostType = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const swagger_1 = require("@nestjs/swagger");
const uuid_1 = require("uuid");
var PostType;
(function (PostType) {
    PostType["LISTING"] = "listing";
    PostType["REQUIREMENT"] = "requirement";
})(PostType || (exports.PostType = PostType = {}));
var PostVisibility;
(function (PostVisibility) {
    PostVisibility["PUBLIC"] = "public";
    PostVisibility["PRIVATE"] = "private";
})(PostVisibility || (exports.PostVisibility = PostVisibility = {}));
var PostStatus;
(function (PostStatus) {
    PostStatus["DRAFT"] = "draft";
    PostStatus["ACTIVE"] = "active";
    PostStatus["INACTIVE"] = "inactive";
})(PostStatus || (exports.PostStatus = PostStatus = {}));
let Post = class Post {
    _id;
    user_id;
    type;
    title;
    description;
    location_text;
    latitude;
    longitude;
    visibility;
    status;
    createdAt;
    updatedAt;
};
exports.Post = Post;
__decorate([
    (0, mongoose_1.Prop)({ default: () => (0, uuid_1.v4)() }),
    (0, swagger_1.ApiProperty)({ description: 'MongoDB ID (UUID)' }),
    __metadata("design:type", String)
], Post.prototype, "_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: String, index: true }),
    (0, swagger_1.ApiProperty)({ description: 'Author user ID' }),
    __metadata("design:type", String)
], Post.prototype, "user_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: PostType, index: true }),
    (0, swagger_1.ApiProperty)({ description: 'Post type', enum: PostType }),
    __metadata("design:type", String)
], Post.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    (0, swagger_1.ApiProperty)({ description: 'Title' }),
    __metadata("design:type", String)
], Post.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    (0, swagger_1.ApiProperty)({ description: 'Description', required: false }),
    __metadata("design:type", String)
], Post.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    (0, swagger_1.ApiProperty)({ description: 'Free-form location text', required: false }),
    __metadata("design:type", String)
], Post.prototype, "location_text", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number }),
    (0, swagger_1.ApiProperty)({ description: 'Latitude', required: false }),
    __metadata("design:type", Number)
], Post.prototype, "latitude", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number }),
    (0, swagger_1.ApiProperty)({ description: 'Longitude', required: false }),
    __metadata("design:type", Number)
], Post.prototype, "longitude", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: PostVisibility, default: PostVisibility.PUBLIC }),
    (0, swagger_1.ApiProperty)({ enum: PostVisibility, default: PostVisibility.PUBLIC }),
    __metadata("design:type", String)
], Post.prototype, "visibility", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: PostStatus, default: PostStatus.ACTIVE, index: true }),
    (0, swagger_1.ApiProperty)({ enum: PostStatus, default: PostStatus.ACTIVE }),
    __metadata("design:type", String)
], Post.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Created at', required: false }),
    __metadata("design:type", Date)
], Post.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Updated at', required: false }),
    __metadata("design:type", Date)
], Post.prototype, "updatedAt", void 0);
exports.Post = Post = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'posts' })
], Post);
exports.PostSchema = mongoose_1.SchemaFactory.createForClass(Post);
exports.PostSchema.index({ user_id: 1, createdAt: -1 });
exports.PostSchema.index({ type: 1, status: 1, createdAt: -1 });
//# sourceMappingURL=post.schema.js.map