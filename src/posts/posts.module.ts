import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './schemas/post.schema';
import {
  PropertyListing,
  PropertyListingSchema,
} from './schemas/property-listing.schema';
import {
  PropertyRequirement,
  PropertyRequirementSchema,
} from './schemas/property-requirement.schema';
import { PostMedia, PostMediaSchema } from './schemas/post-media.schema';
import { Reaction, ReactionSchema } from './schemas/reaction.schema';
import { Comment, CommentSchema } from './schemas/comment.schema';
import { SavedPost, SavedPostSchema } from './schemas/saved-post.schema';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { ReactionsService } from './reactions.service';
import { ReactionsController } from './reactions.controller';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { SavedPostsService } from './saved-posts.service';
import { SavedPostsController } from './saved-posts.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: PropertyListing.name, schema: PropertyListingSchema },
      { name: PropertyRequirement.name, schema: PropertyRequirementSchema },
      { name: PostMedia.name, schema: PostMediaSchema },
      { name: Reaction.name, schema: ReactionSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: SavedPost.name, schema: SavedPostSchema },
    ]),
    AuthModule,
  ],
  controllers: [
    PostsController,
    ReactionsController,
    CommentsController,
    SavedPostsController,
  ],
  providers: [
    PostsService,
    ReactionsService,
    CommentsService,
    SavedPostsService,
  ],
  exports: [PostsService, ReactionsService, CommentsService, SavedPostsService],
})
export class PostsModule {}
