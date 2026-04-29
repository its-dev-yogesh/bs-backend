import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Req,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { UserProfileService } from './user-profile.service';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { UserProfile } from './schemas/user-profile.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { User } from './schemas/user.schema';

function assertProfileOwner(reqUser: User, userId: string) {
  const uid = String(reqUser._id ?? reqUser.id ?? '');
  if (!uid || uid !== userId) {
    throw new ForbiddenException('You can only modify your own profile');
  }
}

@ApiTags('User Profile')
@Controller('users/:userId/profile')
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create user profile' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiBody({ type: CreateUserProfileDto })
  @ApiResponse({
    status: 201,
    description: 'Profile created successfully',
    type: UserProfile,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or profile already exists',
  })
  async create(
    @Param('userId') userId: string,
    @Body() createUserProfileDto: CreateUserProfileDto,
    @Req() req: { user: User },
  ): Promise<UserProfile> {
    assertProfileOwner(req.user, userId);
    return this.userProfileService.create(userId, createUserProfileDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get user profile' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved',
    type: UserProfile,
  })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async findByUserId(
    @Param('userId') userId: string,
  ): Promise<UserProfile | null> {
    return this.userProfileService.findByUserId(userId);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update user profile' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiBody({ type: CreateUserProfileDto })
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully',
    type: UserProfile,
  })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async update(
    @Param('userId') userId: string,
    @Body() updateUserProfileDto: Partial<CreateUserProfileDto>,
    @Req() req: { user: User },
  ): Promise<UserProfile | null> {
    assertProfileOwner(req.user, userId);
    return this.userProfileService.update(userId, updateUserProfileDto);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete user profile' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'Profile deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async delete(
    @Param('userId') userId: string,
    @Req() req: { user: User },
  ): Promise<void> {
    assertProfileOwner(req.user, userId);
    return this.userProfileService.delete(userId);
  }
}
