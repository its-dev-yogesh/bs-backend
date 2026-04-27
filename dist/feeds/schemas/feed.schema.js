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
exports.FeedSchema = exports.Feed = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const swagger_1 = require("@nestjs/swagger");
const uuid_1 = require("uuid");
let Feed = class Feed {
    _id;
    user_id;
    post_id;
    score;
    createdAt;
};
exports.Feed = Feed;
__decorate([
    (0, mongoose_1.Prop)({ default: () => (0, uuid_1.v4)() }),
    (0, swagger_1.ApiProperty)({ description: 'Feed entry ID (UUID)' }),
    __metadata("design:type", String)
], Feed.prototype, "_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: String, index: true }),
    (0, swagger_1.ApiProperty)({ description: 'Owner user ID' }),
    __metadata("design:type", String)
], Feed.prototype, "user_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: String, index: true }),
    (0, swagger_1.ApiProperty)({ description: 'Post ID this entry points to' }),
    __metadata("design:type", String)
], Feed.prototype, "post_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: Number, default: 0 }),
    (0, swagger_1.ApiProperty)({ description: 'Ranking score (higher = surfaced first)' }),
    __metadata("design:type", Number)
], Feed.prototype, "score", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Date)
], Feed.prototype, "createdAt", void 0);
exports.Feed = Feed = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: { createdAt: true, updatedAt: false },
        collection: 'feeds',
    })
], Feed);
exports.FeedSchema = mongoose_1.SchemaFactory.createForClass(Feed);
exports.FeedSchema.index({ user_id: 1, post_id: 1 }, { unique: true });
exports.FeedSchema.index({ user_id: 1, score: -1, createdAt: -1 });
//# sourceMappingURL=feed.schema.js.map