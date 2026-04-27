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
exports.PostMediaSchema = exports.PostMedia = exports.MediaType = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const swagger_1 = require("@nestjs/swagger");
const uuid_1 = require("uuid");
var MediaType;
(function (MediaType) {
    MediaType["IMAGE"] = "image";
    MediaType["VIDEO"] = "video";
})(MediaType || (exports.MediaType = MediaType = {}));
let PostMedia = class PostMedia {
    _id;
    post_id;
    url;
    type;
    order_index;
    createdAt;
    updatedAt;
};
exports.PostMedia = PostMedia;
__decorate([
    (0, mongoose_1.Prop)({ default: () => (0, uuid_1.v4)() }),
    (0, swagger_1.ApiProperty)({ description: 'MongoDB ID (UUID)' }),
    __metadata("design:type", String)
], PostMedia.prototype, "_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: String, index: true }),
    (0, swagger_1.ApiProperty)({ description: 'Reference to Post ID' }),
    __metadata("design:type", String)
], PostMedia.prototype, "post_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    (0, swagger_1.ApiProperty)({ description: 'Media URL' }),
    __metadata("design:type", String)
], PostMedia.prototype, "url", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: MediaType }),
    (0, swagger_1.ApiProperty)({ enum: MediaType }),
    __metadata("design:type", String)
], PostMedia.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    (0, swagger_1.ApiProperty)({ description: 'Display order index', default: 0 }),
    __metadata("design:type", Number)
], PostMedia.prototype, "order_index", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Date)
], PostMedia.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Date)
], PostMedia.prototype, "updatedAt", void 0);
exports.PostMedia = PostMedia = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'post_media' })
], PostMedia);
exports.PostMediaSchema = mongoose_1.SchemaFactory.createForClass(PostMedia);
exports.PostMediaSchema.index({ post_id: 1, order_index: 1 });
//# sourceMappingURL=post-media.schema.js.map