import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/schemas/user.schema';
import { FollowsService } from './follows.service';

@ApiTags('Follows')
@Controller('users/:userId/follow')
export class FollowsController {
  constructor(private readonly followsService: FollowsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({ summary: 'Follow a user' })
  follow(@Param('userId') userId: string, @CurrentUser() user: User) {
    return this.followsService.follow(user._id ?? user.id ?? '', userId);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({ summary: 'Unfollow a user' })
  unfollow(@Param('userId') userId: string, @CurrentUser() user: User) {
    return this.followsService.unfollow(user._id ?? user.id ?? '', userId);
  }

  @Get('status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({
    summary: 'Whether the current user follows this user, plus follower counts',
  })
  async status(@Param('userId') userId: string, @CurrentUser() user: User) {
    const me = user._id ?? user.id ?? '';
    const [is_following, followers_count, following_count] = await Promise.all([
      this.followsService.isFollowing(me, userId),
      this.followsService.countFollowers(userId),
      this.followsService.countFollowing(userId),
    ]);
    return { is_following, followers_count, following_count };
  }
}
