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
exports.SavedPostSchema = exports.SavedPost = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const swagger_1 = require("@nestjs/swagger");
const uuid_1 = require("uuid");
let SavedPost = class SavedPost {
    _id;
    user_id;
    post_id;
    createdAt;
};
exports.SavedPost = SavedPost;
__decorate([
    (0, mongoose_1.Prop)({ default: () => (0, uuid_1.v4)() }),
    (0, swagger_1.ApiProperty)({ description: 'MongoDB ID (UUID)' }),
    __metadata("design:type", String)
], SavedPost.prototype, "_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: String, index: true }),
    (0, swagger_1.ApiProperty)({ description: 'User ID' }),
    __metadata("design:type", String)
], SavedPost.prototype, "user_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: String, index: true }),
    (0, swagger_1.ApiProperty)({ description: 'Post ID' }),
    __metadata("design:type", String)
], SavedPost.prototype, "post_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Date)
], SavedPost.prototype, "createdAt", void 0);
exports.SavedPost = SavedPost = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: { createdAt: true, updatedAt: false },
        collection: 'saved_posts',
    })
], SavedPost);
exports.SavedPostSchema = mongoose_1.SchemaFactory.createForClass(SavedPost);
exports.SavedPostSchema.index({ user_id: 1, post_id: 1 }, { unique: true });
exports.SavedPostSchema.index({ user_id: 1, createdAt: -1 });
//# sourceMappingURL=saved-post.schema.js.map