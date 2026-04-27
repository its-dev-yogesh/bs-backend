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
exports.PostsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const user_schema_1 = require("../users/schemas/user.schema");
const posts_service_1 = require("./posts.service");
const create_post_dto_1 = require("./dto/create-post.dto");
const create_post_media_dto_1 = require("./dto/create-post-media.dto");
const post_schema_1 = require("./schemas/post.schema");
let PostsController = class PostsController {
    postsService;
    constructor(postsService) {
        this.postsService = postsService;
    }
    createListing(user, dto) {
        return this.postsService.createListing(user._id ?? user.id ?? '', user.type, dto);
    }
    createRequirement(user, dto) {
        return this.postsService.createRequirement(user._id ?? user.id ?? '', user.type, dto);
    }
    findAll(type, user_id, limit, skip) {
        return this.postsService.findAll({
            type,
            user_id,
            limit: limit ? Number(limit) : undefined,
            skip: skip ? Number(skip) : undefined,
        });
    }
    findById(id) {
        return this.postsService.findById(id);
    }
    update(id, user, dto) {
        return this.postsService.update(id, user._id ?? user.id ?? '', dto);
    }
    publish(id, user) {
        return this.postsService.publish(id, user._id ?? user.id ?? '');
    }
    myDrafts(user) {
        return this.postsService.findDraftsByUser(user._id ?? user.id ?? '');
    }
    remove(id, user) {
        return this.postsService.remove(id, user._id ?? user.id ?? '');
    }
    addMedia(id, user, dto) {
        return this.postsService.addMedia(id, user._id ?? user.id ?? '', dto);
    }
    listMedia(id) {
        return this.postsService.listMedia(id);
    }
    removeMedia(media_id, user) {
        return this.postsService.removeMedia(media_id, user._id ?? user.id ?? '');
    }
};
exports.PostsController = PostsController;
__decorate([
    (0, common_1.Post)('listings'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('jwt-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a property listing (agents only)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Listing post created' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Only agents can post listings' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User, create_post_dto_1.CreateListingPostDto]),
    __metadata("design:returntype", void 0)
], PostsController.prototype, "createListing", null);
__decorate([
    (0, common_1.Post)('requirements'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('jwt-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a property requirement (users only)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Requirement post created' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Only users can post requirements' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User,
        create_post_dto_1.CreateRequirementPostDto]),
    __metadata("design:returntype", void 0)
], PostsController.prototype, "createRequirement", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List posts' }),
    (0, swagger_1.ApiQuery)({ name: 'type', required: false, enum: post_schema_1.PostType }),
    (0, swagger_1.ApiQuery)({ name: 'user_id', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'skip', required: false, type: Number }),
    __param(0, (0, common_1.Query)('type')),
    __param(1, (0, common_1.Query)('user_id')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('skip')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], PostsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a post with subtype + media' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PostsController.prototype, "findById", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('jwt-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a post (author only)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_schema_1.User,
        create_post_dto_1.UpdatePostDto]),
    __metadata("design:returntype", void 0)
], PostsController.prototype, "update", null);
__decorate([
    (0, common_1.Put)(':id/publish'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('jwt-auth'),
    (0, swagger_1.ApiOperation)({
        summary: 'Publish a draft post (status -> active, triggers feed fan-out)',
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_schema_1.User]),
    __metadata("design:returntype", void 0)
], PostsController.prototype, "publish", null);
__decorate([
    (0, common_1.Get)('me/drafts'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('jwt-auth'),
    (0, swagger_1.ApiOperation)({ summary: "List the current user's draft posts" }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User]),
    __metadata("design:returntype", void 0)
], PostsController.prototype, "myDrafts", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('jwt-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a post (author only)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_schema_1.User]),
    __metadata("design:returntype", void 0)
], PostsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/media'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('jwt-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Add media to a post' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_schema_1.User,
        create_post_media_dto_1.CreatePostMediaDto]),
    __metadata("design:returntype", void 0)
], PostsController.prototype, "addMedia", null);
__decorate([
    (0, common_1.Get)(':id/media'),
    (0, swagger_1.ApiOperation)({ summary: 'List media for a post' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PostsController.prototype, "listMedia", null);
__decorate([
    (0, common_1.Delete)('media/:media_id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('jwt-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a media item (post author only)' }),
    __param(0, (0, common_1.Param)('media_id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_schema_1.User]),
    __metadata("design:returntype", void 0)
], PostsController.prototype, "removeMedia", null);
exports.PostsController = PostsController = __decorate([
    (0, swagger_1.ApiTags)('Posts'),
    (0, common_1.Controller)('posts'),
    __metadata("design:paramtypes", [posts_service_1.PostsService])
], PostsController);
//# sourceMappingURL=posts.controller.js.map