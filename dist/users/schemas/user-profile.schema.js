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
exports.UserProfileSchema = exports.UserProfile = exports.Gender = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const swagger_1 = require("@nestjs/swagger");
const uuid_1 = require("uuid");
var Gender;
(function (Gender) {
    Gender["MALE"] = "male";
    Gender["FEMALE"] = "female";
    Gender["OTHER"] = "other";
})(Gender || (exports.Gender = Gender = {}));
let UserProfile = class UserProfile {
    id;
    _id;
    user_id;
    full_name;
    bio;
    avatar_url;
    website;
    dob;
    gender;
    rerano;
    location;
    createdAt;
    updatedAt;
};
exports.UserProfile = UserProfile;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Unique identifier (UUID)',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], UserProfile.prototype, "id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: () => (0, uuid_1.v4)(), unique: true }),
    (0, swagger_1.ApiProperty)({
        description: 'MongoDB ID',
    }),
    __metadata("design:type", String)
], UserProfile.prototype, "_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: String }),
    (0, swagger_1.ApiProperty)({
        description: 'Reference to User ID',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], UserProfile.prototype, "user_id", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    (0, swagger_1.ApiProperty)({
        description: 'Full name of the user',
        example: 'John Doe',
        required: false,
    }),
    __metadata("design:type", String)
], UserProfile.prototype, "full_name", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    (0, swagger_1.ApiProperty)({
        description: 'Biography or bio description',
        example: 'Real estate agent with 10+ years of experience',
        required: false,
    }),
    __metadata("design:type", String)
], UserProfile.prototype, "bio", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    (0, swagger_1.ApiProperty)({
        description: 'Avatar image URL',
        example: 'https://example.com/avatars/user123.jpg',
        required: false,
    }),
    __metadata("design:type", String)
], UserProfile.prototype, "avatar_url", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    (0, swagger_1.ApiProperty)({
        description: 'Personal or business website',
        example: 'https://www.johndoe.com',
        required: false,
    }),
    __metadata("design:type", String)
], UserProfile.prototype, "website", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    (0, swagger_1.ApiProperty)({
        description: 'Date of birth',
        example: '1990-01-15',
        required: false,
    }),
    __metadata("design:type", Date)
], UserProfile.prototype, "dob", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: Gender }),
    (0, swagger_1.ApiProperty)({
        description: 'Gender: male, female, or other',
        enum: Gender,
        required: false,
    }),
    __metadata("design:type", String)
], UserProfile.prototype, "gender", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    (0, swagger_1.ApiProperty)({
        description: 'Real Estate Registration Number (for agents)',
        example: 'RE123456789',
        required: false,
    }),
    __metadata("design:type", String)
], UserProfile.prototype, "rerano", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    (0, swagger_1.ApiProperty)({
        description: 'Location/Address',
        example: 'New York, NY, USA',
        required: false,
    }),
    __metadata("design:type", String)
], UserProfile.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Profile creation timestamp',
        example: '2024-04-26T19:00:00.000Z',
    }),
    __metadata("design:type", Date)
], UserProfile.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Last update timestamp',
        example: '2024-04-26T19:00:00.000Z',
    }),
    __metadata("design:type", Date)
], UserProfile.prototype, "updatedAt", void 0);
exports.UserProfile = UserProfile = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], UserProfile);
exports.UserProfileSchema = mongoose_1.SchemaFactory.createForClass(UserProfile);
exports.UserProfileSchema.index({ user_id: 1 });
//# sourceMappingURL=user-profile.schema.js.map