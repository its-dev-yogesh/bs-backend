import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UserProfile, UserProfileSchema } from './schemas/user-profile.schema';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserProfileService } from './user-profile.service';
import { UserProfileController } from './user-profile.controller';
import { AuthModule } from '../auth/auth.module';
import { ConnectionsModule } from '../connections/connections.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserProfile.name, schema: UserProfileSchema },
    ]),
    forwardRef(() => AuthModule),
    forwardRef(() => ConnectionsModule),
  ],
  controllers: [UsersController, UserProfileController],
  providers: [UsersService, UserProfileService],
  exports: [UsersService, UserProfileService],
})
export class UsersModule {}
