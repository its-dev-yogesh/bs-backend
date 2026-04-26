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
exports.UserProfileController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const user_profile_service_1 = require("./user-profile.service");
const create_user_profile_dto_1 = require("./dto/create-user-profile.dto");
const user_profile_schema_1 = require("./schemas/user-profile.schema");
let UserProfileController = class UserProfileController {
    userProfileService;
    constructor(userProfileService) {
        this.userProfileService = userProfileService;
    }
    async create(userId, createUserProfileDto) {
        return this.userProfileService.create(userId, createUserProfileDto);
    }
    async findByUserId(userId) {
        return this.userProfileService.findByUserId(userId);
    }
    async update(userId, updateUserProfileDto) {
        return this.userProfileService.update(userId, updateUserProfileDto);
    }
    async delete(userId) {
        return this.userProfileService.delete(userId);
    }
};
exports.UserProfileController = UserProfileController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create user profile' }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'User ID' }),
    (0, swagger_1.ApiBody)({ type: create_user_profile_dto_1.CreateUserProfileDto }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Profile created successfully',
        type: user_profile_schema_1.UserProfile,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input or profile already exists' }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_user_profile_dto_1.CreateUserProfileDto]),
    __metadata("design:returntype", Promise)
], UserProfileController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get user profile' }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'User ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User profile retrieved',
        type: user_profile_schema_1.UserProfile,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Profile not found' }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserProfileController.prototype, "findByUserId", null);
__decorate([
    (0, common_1.Put)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update user profile' }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'User ID' }),
    (0, swagger_1.ApiBody)({ type: create_user_profile_dto_1.CreateUserProfileDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Profile updated successfully',
        type: user_profile_schema_1.UserProfile,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Profile not found' }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserProfileController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete user profile' }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'User ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Profile deleted successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Profile not found' }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserProfileController.prototype, "delete", null);
exports.UserProfileController = UserProfileController = __decorate([
    (0, swagger_1.ApiTags)('User Profile'),
    (0, common_1.Controller)('users/:userId/profile'),
    __metadata("design:paramtypes", [user_profile_service_1.UserProfileService])
], UserProfileController);
//# sourceMappingURL=user-profile.controller.js.map