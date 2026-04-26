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
exports.UserSchema = exports.User = exports.UserStatus = exports.UserType = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const swagger_1 = require("@nestjs/swagger");
const uuid_1 = require("uuid");
var UserType;
(function (UserType) {
    UserType["AGENT"] = "agent";
    UserType["USER"] = "user";
})(UserType || (exports.UserType = UserType = {}));
var UserStatus;
(function (UserStatus) {
    UserStatus["ACTIVE"] = "active";
    UserStatus["BANNED"] = "banned";
    UserStatus["DELETED"] = "deleted";
})(UserStatus || (exports.UserStatus = UserStatus = {}));
let User = class User {
    id;
    _id;
    username;
    email;
    phone;
    password_hash;
    is_verified;
    type;
    status;
    createdAt;
    updatedAt;
};
exports.User = User;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Unique identifier (UUID)',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: () => (0, uuid_1.v4)(), unique: true }),
    (0, swagger_1.ApiProperty)({
        description: 'MongoDB ID',
    }),
    __metadata("design:type", String)
], User.prototype, "_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    (0, swagger_1.ApiProperty)({
        description: 'Unique username',
        example: 'johndoe',
    }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    (0, swagger_1.ApiProperty)({
        description: 'Email address',
        example: 'john@example.com',
    }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    (0, swagger_1.ApiProperty)({
        description: 'Phone number',
        example: '+1234567890',
        required: false,
    }),
    __metadata("design:type", String)
], User.prototype, "phone", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    (0, swagger_1.ApiProperty)({
        description: 'Hashed password (bcrypt)',
        example: '$2b$10$...',
    }),
    __metadata("design:type", String)
], User.prototype, "password_hash", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    (0, swagger_1.ApiProperty)({
        description: 'Email verification status',
        example: false,
    }),
    __metadata("design:type", Boolean)
], User.prototype, "is_verified", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: UserType, default: UserType.USER }),
    (0, swagger_1.ApiProperty)({
        description: 'User type: agent or regular user',
        enum: UserType,
        example: UserType.USER,
    }),
    __metadata("design:type", String)
], User.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: UserStatus, default: UserStatus.ACTIVE }),
    (0, swagger_1.ApiProperty)({
        description: 'Account status',
        enum: UserStatus,
        example: UserStatus.ACTIVE,
    }),
    __metadata("design:type", String)
], User.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Account creation timestamp',
        example: '2024-04-26T19:00:00.000Z',
    }),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Last update timestamp',
        example: '2024-04-26T19:00:00.000Z',
    }),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
exports.User = User = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], User);
exports.UserSchema = mongoose_1.SchemaFactory.createForClass(User);
exports.UserSchema.index({ username: 1 });
exports.UserSchema.index({ email: 1 });
exports.UserSchema.index({ type: 1 });
exports.UserSchema.index({ status: 1 });
//# sourceMappingURL=user.schema.js.map