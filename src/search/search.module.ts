import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from '../posts/schemas/post.schema';
import {
  PropertyListing,
  PropertyListingSchema,
} from '../posts/schemas/property-listing.schema';
import {
  PropertyRequirement,
  PropertyRequirementSchema,
} from '../posts/schemas/property-requirement.schema';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: PropertyListing.name, schema: PropertyListingSchema },
      { name: PropertyRequirement.name, schema: PropertyRequirementSchema },
    ]),
  ],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
