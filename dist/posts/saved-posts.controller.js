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
exports.SavedPostsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const user_schema_1 = require("../users/schemas/user.schema");
const saved_posts_service_1 = require("./saved-posts.service");
let SavedPostsController = class SavedPostsController {
    savedPostsService;
    constructor(savedPostsService) {
        this.savedPostsService = savedPostsService;
    }
    save(post_id, user) {
        return this.savedPostsService.save(user._id ?? user.id ?? '', post_id);
    }
    unsave(post_id, user) {
        return this.savedPostsService.unsave(user._id ?? user.id ?? '', post_id);
    }
    list(user) {
        return this.savedPostsService.listForUser(user._id ?? user.id ?? '');
    }
    isSaved(post_id, user) {
        return this.savedPostsService
            .isSaved(user._id ?? user.id ?? '', post_id)
            .then((saved) => ({ saved }));
    }
};
exports.SavedPostsController = SavedPostsController;
__decorate([
    (0, common_1.Post)('posts/:post_id/save'),
    (0, swagger_1.ApiOperation)({ summary: 'Bookmark a post' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Post saved' }),
    __param(0, (0, common_1.Param)('post_id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_schema_1.User]),
    __metadata("design:returntype", void 0)
], SavedPostsController.prototype, "save", null);
__decorate([
    (0, common_1.Delete)('posts/:post_id/save'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove bookmark' }),
    __param(0, (0, common_1.Param)('post_id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_schema_1.User]),
    __metadata("design:returntype", void 0)
], SavedPostsController.prototype, "unsave", null);
__decorate([
    (0, common_1.Get)('saved-posts'),
    (0, swagger_1.ApiOperation)({ summary: 'List my saved posts' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User]),
    __metadata("design:returntype", void 0)
], SavedPostsController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('posts/:post_id/saved'),
    (0, swagger_1.ApiOperation)({ summary: 'Check whether the current user saved this post' }),
    __param(0, (0, common_1.Param)('post_id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_schema_1.User]),
    __metadata("design:returntype", void 0)
], SavedPostsController.prototype, "isSaved", null);
exports.SavedPostsController = SavedPostsController = __decorate([
    (0, swagger_1.ApiTags)('Saved Posts'),
    (0, common_1.Controller)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('jwt-auth'),
    __metadata("design:paramtypes", [saved_posts_service_1.SavedPostsService])
], SavedPostsController);
//# sourceMappingURL=saved-posts.controller.js.map