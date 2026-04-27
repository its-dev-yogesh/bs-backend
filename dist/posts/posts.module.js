"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const post_schema_1 = require("./schemas/post.schema");
const property_listing_schema_1 = require("./schemas/property-listing.schema");
const property_requirement_schema_1 = require("./schemas/property-requirement.schema");
const post_media_schema_1 = require("./schemas/post-media.schema");
const reaction_schema_1 = require("./schemas/reaction.schema");
const comment_schema_1 = require("./schemas/comment.schema");
const saved_post_schema_1 = require("./schemas/saved-post.schema");
const posts_service_1 = require("./posts.service");
const posts_controller_1 = require("./posts.controller");
const reactions_service_1 = require("./reactions.service");
const reactions_controller_1 = require("./reactions.controller");
const comments_service_1 = require("./comments.service");
const comments_controller_1 = require("./comments.controller");
const saved_posts_service_1 = require("./saved-posts.service");
const saved_posts_controller_1 = require("./saved-posts.controller");
const auth_module_1 = require("../auth/auth.module");
let PostsModule = class PostsModule {
};
exports.PostsModule = PostsModule;
exports.PostsModule = PostsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: post_schema_1.Post.name, schema: post_schema_1.PostSchema },
                { name: property_listing_schema_1.PropertyListing.name, schema: property_listing_schema_1.PropertyListingSchema },
                { name: property_requirement_schema_1.PropertyRequirement.name, schema: property_requirement_schema_1.PropertyRequirementSchema },
                { name: post_media_schema_1.PostMedia.name, schema: post_media_schema_1.PostMediaSchema },
                { name: reaction_schema_1.Reaction.name, schema: reaction_schema_1.ReactionSchema },
                { name: comment_schema_1.Comment.name, schema: comment_schema_1.CommentSchema },
                { name: saved_post_schema_1.SavedPost.name, schema: saved_post_schema_1.SavedPostSchema },
            ]),
            auth_module_1.AuthModule,
        ],
        controllers: [
            posts_controller_1.PostsController,
            reactions_controller_1.ReactionsController,
            comments_controller_1.CommentsController,
            saved_posts_controller_1.SavedPostsController,
        ],
        providers: [
            posts_service_1.PostsService,
            reactions_service_1.ReactionsService,
            comments_service_1.CommentsService,
            saved_posts_service_1.SavedPostsService,
        ],
        exports: [posts_service_1.PostsService, reactions_service_1.ReactionsService, comments_service_1.CommentsService, saved_posts_service_1.SavedPostsService],
    })
], PostsModule);
//# sourceMappingURL=posts.module.js.map