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
exports.CommentSchema = exports.Comment = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const swagger_1 = require("@nestjs/swagger");
const uuid_1 = require("uuid");
let Comment = class Comment {
    _id;
    post_id;
    user_id;
    parent_id;
    content;
    createdAt;
    updatedAt;
};
exports.Comment = Comment;
__decorate([
    (0, mongoose_1.Prop)({ default: () => (0, uuid_1.v4)() }),
    (0, swagger_1.ApiProperty)({ description: 'MongoDB ID (UUID)' }),
    __metadata("design:type", String)
], Comment.prototype, "_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: String, index: true }),
    (0, swagger_1.ApiProperty)({ description: 'Post ID' }),
    __metadata("design:type", String)
], Comment.prototype, "post_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: String, index: true }),
    (0, swagger_1.ApiProperty)({ description: 'Author user ID' }),
    __metadata("design:type", String)
], Comment.prototype, "user_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: null, index: true }),
    (0, swagger_1.ApiProperty)({
        description: 'Parent comment ID for threaded replies',
        required: false,
        nullable: true,
    }),
    __metadata("design:type", Object)
], Comment.prototype, "parent_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    (0, swagger_1.ApiProperty)({ description: 'Comment content' }),
    __metadata("design:type", String)
], Comment.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Date)
], Comment.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Date)
], Comment.prototype, "updatedAt", void 0);
exports.Comment = Comment = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'comments' })
], Comment);
exports.CommentSchema = mongoose_1.SchemaFactory.createForClass(Comment);
exports.CommentSchema.index({ post_id: 1, createdAt: -1 });
exports.CommentSchema.index({ post_id: 1, parent_id: 1, createdAt: 1 });
//# sourceMappingURL=comment.schema.js.map