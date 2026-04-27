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
exports.ReactionsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const user_schema_1 = require("../users/schemas/user.schema");
const reactions_service_1 = require("./reactions.service");
const create_reaction_dto_1 = require("./dto/create-reaction.dto");
let ReactionsController = class ReactionsController {
    reactionsService;
    constructor(reactionsService) {
        this.reactionsService = reactionsService;
    }
    upsert(post_id, user, dto) {
        return this.reactionsService.upsert(user._id ?? user.id ?? '', post_id, dto.type);
    }
    remove(post_id, user) {
        return this.reactionsService.remove(user._id ?? user.id ?? '', post_id);
    }
    findByPost(post_id) {
        return this.reactionsService.findByPost(post_id);
    }
    counts(post_id) {
        return this.reactionsService.countsByPost(post_id);
    }
};
exports.ReactionsController = ReactionsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('jwt-auth'),
    (0, swagger_1.ApiOperation)({
        summary: 'Add or update a reaction (like/interested) on a post',
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Reaction recorded' }),
    __param(0, (0, common_1.Param)('post_id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_schema_1.User,
        create_reaction_dto_1.CreateReactionDto]),
    __metadata("design:returntype", void 0)
], ReactionsController.prototype, "upsert", null);
__decorate([
    (0, common_1.Delete)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('jwt-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove your reaction from a post' }),
    __param(0, (0, common_1.Param)('post_id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_schema_1.User]),
    __metadata("design:returntype", void 0)
], ReactionsController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List reactions on a post' }),
    __param(0, (0, common_1.Param)('post_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReactionsController.prototype, "findByPost", null);
__decorate([
    (0, common_1.Get)('counts'),
    (0, swagger_1.ApiOperation)({ summary: 'Reaction counts grouped by type' }),
    __param(0, (0, common_1.Param)('post_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReactionsController.prototype, "counts", null);
exports.ReactionsController = ReactionsController = __decorate([
    (0, swagger_1.ApiTags)('Reactions'),
    (0, common_1.Controller)('posts/:post_id/reactions'),
    __metadata("design:paramtypes", [reactions_service_1.ReactionsService])
], ReactionsController);
//# sourceMappingURL=reactions.controller.js.map