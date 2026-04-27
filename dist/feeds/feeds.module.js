"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const feed_schema_1 = require("./schemas/feed.schema");
const feeds_service_1 = require("./feeds.service");
const feeds_controller_1 = require("./feeds.controller");
const posts_module_1 = require("../posts/posts.module");
const auth_module_1 = require("../auth/auth.module");
let FeedsModule = class FeedsModule {
};
exports.FeedsModule = FeedsModule;
exports.FeedsModule = FeedsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: feed_schema_1.Feed.name, schema: feed_schema_1.FeedSchema }]),
            posts_module_1.PostsModule,
            auth_module_1.AuthModule,
        ],
        controllers: [feeds_controller_1.FeedsController],
        providers: [feeds_service_1.FeedsService],
        exports: [feeds_service_1.FeedsService],
    })
], FeedsModule);
//# sourceMappingURL=feeds.module.js.map