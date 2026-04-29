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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UserProfileService } from './user-profile.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';
import { UserProfile } from './schemas/user-profile.schema';
import { ConnectionsService } from '../connections/connections.service';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';

/** Public view: core user + profile fields (connection stats added in controller). */
function mergeUserAndProfile(
  user: User,
  profile: UserProfile | null,
): Record<string, unknown> {
  const uid = user._id ?? user.id;
  return {
    ...user,
    _id: uid,
    id: uid,
    name: profile?.full_name,
    headline: profile?.headline,
    bio: profile?.bio,
    location: profile?.location,
    avatarUrl: profile?.avatar_url,
    avatarPositionY: profile?.avatar_position_y,
    avatarZoom: profile?.avatar_zoom,
    bannerUrl: profile?.banner_url,
    bannerPositionY: profile?.banner_position_y,
    bannerZoom: profile?.banner_zoom,
    bannerTheme: profile?.banner_theme,
  };
}

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly userProfileService: UserProfileService,
    private readonly connectionsService: ConnectionsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    type: User,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or user already exists',
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'List of all users',
    type: [User],
  })
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get('username/:username')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({
    summary:
      'Get user by username (profile + connections count; optional Bearer sets viewer relationship)',
  })
  @ApiParam({ name: 'username', description: 'Username' })
  @ApiResponse({
    status: 200,
    description: 'User found',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findByUsername(
    @Param('username') username: string,
    @Req() req: { user?: User },
  ) {
    const user = await this.usersService.findByUsername(username);
    if (!user) return null;
    const profileUserId = String(user._id ?? user.id);
    const profile = await this.userProfileService.findByUserId(profileUserId);
    const merged = mergeUserAndProfile(user, profile) as Record<string, unknown>;

    merged.connectionsCount =
      await this.connectionsService.countAcceptedConnections(profileUserId);

    const viewerId = req.user
      ? String(req.user._id ?? req.user.id)
      : '';
    if (viewerId && viewerId !== profileUserId) {
      const rel = await this.connectionsService.getRelationship(
        viewerId,
        profileUserId,
      );
      merged.isConnected = rel.isConnected;
      merged.isPendingRequest = rel.pendingOutgoing || rel.pendingIncoming;
      merged.pendingOutgoing = rel.pendingOutgoing;
      merged.pendingIncoming = rel.pendingIncoming;
      merged.pendingRequestId = rel.pendingRequestId;
    } else {
      merged.isConnected = false;
      merged.isPendingRequest = false;
      merged.pendingOutgoing = false;
      merged.pendingIncoming = false;
      merged.pendingRequestId = undefined;
    }

    return merged;
  }

  @Get('email/:email')
  @ApiOperation({ summary: 'Get user by email' })
  @ApiParam({ name: 'email', description: 'Email address' })
  @ApiResponse({
    status: 200,
    description: 'User found',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findByEmail(@Param('email') email: string): Promise<User | null> {
    return this.usersService.findByEmail(email);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'User ID (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'User found',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findById(@Param('id') id: string): Promise<User | null> {
    return this.usersService.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user' })
  @ApiParam({ name: 'id', description: 'User ID (UUID)' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: Partial<CreateUserDto>,
  ): Promise<User | null> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  @ApiParam({ name: 'id', description: 'User ID (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }
}
