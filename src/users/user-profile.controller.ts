import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { UserProfileService } from './user-profile.service';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { UserProfile } from './schemas/user-profile.schema';

@ApiTags('User Profile')
@Controller('users/:userId/profile')
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) { }

  @Post()
  @ApiOperation({ summary: 'Create user profile' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiBody({ type: CreateUserProfileDto })
  @ApiResponse({
    status: 201,
    description: 'Profile created successfully',
    type: UserProfile,
  })
  @ApiResponse({ status: 400, description: 'Invalid input or profile already exists' })
  async create(
    @Param('userId') userId: string,
    @Body() createUserProfileDto: CreateUserProfileDto,
  ): Promise<UserProfile> {
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
  async findByUserId(@Param('userId') userId: string): Promise<UserProfile | null> {
    return this.userProfileService.findByUserId(userId);
  }

  @Put()
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
  ): Promise<UserProfile | null> {
    return this.userProfileService.update(userId, updateUserProfileDto);
  }

  @Delete()
  @ApiOperation({ summary: 'Delete user profile' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'Profile deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async delete(@Param('userId') userId: string): Promise<void> {
    return this.userProfileService.delete(userId);
  }
}
