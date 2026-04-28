import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/schemas/user.schema';
import { Post, PostSchema } from '../posts/schemas/post.schema';
import {
  PropertyListing,
  PropertyListingSchema,
} from '../posts/schemas/property-listing.schema';
import {
  PropertyRequirement,
  PropertyRequirementSchema,
} from '../posts/schemas/property-requirement.schema';
import {
  PostMedia,
  PostMediaSchema,
} from '../posts/schemas/post-media.schema';
import { Feed, FeedSchema } from '../feeds/schemas/feed.schema';
import { PostsModule } from '../posts/posts.module';
import { AuthModule } from '../auth/auth.module';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Post.name, schema: PostSchema },
      { name: PropertyListing.name, schema: PropertyListingSchema },
      { name: PropertyRequirement.name, schema: PropertyRequirementSchema },
      { name: PostMedia.name, schema: PostMediaSchema },
      { name: Feed.name, schema: FeedSchema },
    ]),
    PostsModule,
    AuthModule,
  ],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
