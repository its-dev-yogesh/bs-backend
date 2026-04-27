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
exports.FeedsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const user_schema_1 = require("../users/schemas/user.schema");
const feeds_service_1 = require("./feeds.service");
let FeedsController = class FeedsController {
    feedsService;
    constructor(feedsService) {
        this.feedsService = feedsService;
    }
    getFeed(user, limit, skip) {
        return this.feedsService.getFeed(user._id ?? user.id ?? '', {
            limit: limit ? Number(limit) : undefined,
            skip: skip ? Number(skip) : undefined,
        });
    }
    regenerate(user) {
        return this.feedsService.regenerate(user._id ?? user.id ?? '', user.type);
    }
};
exports.FeedsController = FeedsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: "Get the authenticated user's feed. Agents see requirement posts; users see listing posts. Sorted by score desc.",
    }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'skip', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of feed items, each containing post details + media + reaction/comment/save/inquiry counts.',
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('skip')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User, String, String]),
    __metadata("design:returntype", void 0)
], FeedsController.prototype, "getFeed", null);
__decorate([
    (0, common_1.Post)('regenerate'),
    (0, swagger_1.ApiOperation)({
        summary: "Rebuild the current user's feed from active posts of the role-relevant type. Score is set to 0 — replace with real scoring later.",
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User]),
    __metadata("design:returntype", void 0)
], FeedsController.prototype, "regenerate", null);
exports.FeedsController = FeedsController = __decorate([
    (0, swagger_1.ApiTags)('Feeds'),
    (0, common_1.Controller)('feeds'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('jwt-auth'),
    __metadata("design:paramtypes", [feeds_service_1.FeedsService])
], FeedsController);
//# sourceMappingURL=feeds.controller.js.map