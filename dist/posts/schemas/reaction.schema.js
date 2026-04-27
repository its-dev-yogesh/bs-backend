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
exports.ReactionSchema = exports.Reaction = exports.ReactionType = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const swagger_1 = require("@nestjs/swagger");
const uuid_1 = require("uuid");
var ReactionType;
(function (ReactionType) {
    ReactionType["LIKE"] = "like";
    ReactionType["INTERESTED"] = "interested";
})(ReactionType || (exports.ReactionType = ReactionType = {}));
let Reaction = class Reaction {
    _id;
    user_id;
    post_id;
    type;
    createdAt;
};
exports.Reaction = Reaction;
__decorate([
    (0, mongoose_1.Prop)({ default: () => (0, uuid_1.v4)() }),
    (0, swagger_1.ApiProperty)({ description: 'MongoDB ID (UUID)' }),
    __metadata("design:type", String)
], Reaction.prototype, "_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: String, index: true }),
    (0, swagger_1.ApiProperty)({ description: 'User ID' }),
    __metadata("design:type", String)
], Reaction.prototype, "user_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: String, index: true }),
    (0, swagger_1.ApiProperty)({ description: 'Post ID' }),
    __metadata("design:type", String)
], Reaction.prototype, "post_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ReactionType }),
    (0, swagger_1.ApiProperty)({ enum: ReactionType }),
    __metadata("design:type", String)
], Reaction.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Date)
], Reaction.prototype, "createdAt", void 0);
exports.Reaction = Reaction = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: { createdAt: true, updatedAt: false },
        collection: 'reactions',
    })
], Reaction);
exports.ReactionSchema = mongoose_1.SchemaFactory.createForClass(Reaction);
exports.ReactionSchema.index({ user_id: 1, post_id: 1 }, { unique: true });
exports.ReactionSchema.index({ post_id: 1, type: 1 });
//# sourceMappingURL=reaction.schema.js.map