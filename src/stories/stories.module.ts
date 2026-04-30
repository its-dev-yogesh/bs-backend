import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Story, StorySchema } from './schemas/story.schema';
import { StoriesController } from './stories.controller';
import { StoriesService } from './stories.service';
import { ConnectionsModule } from '../connections/connections.module';
import { User, UserSchema } from '../users/schemas/user.schema';
import {
  UserProfile,
  UserProfileSchema,
} from '../users/schemas/user-profile.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Story.name, schema: StorySchema },
      { name: User.name, schema: UserSchema },
      { name: UserProfile.name, schema: UserProfileSchema },
    ]),
    ConnectionsModule,
  ],
  controllers: [StoriesController],
  providers: [StoriesService],
  exports: [StoriesService],
})
export class StoriesModule {}
