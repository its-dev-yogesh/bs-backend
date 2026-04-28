import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/schemas/user.schema';
import { FeedsService } from './feeds.service';

@ApiTags('Feeds')
@Controller('feeds')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('jwt-auth')
export class FeedsController {
  constructor(private readonly feedsService: FeedsService) {}

  @Get()
  @ApiOperation({
    summary:
      "Get the authenticated user's feed. Agents see both listings and requirements; users see only listings. Sorted by score desc.",
  })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description:
      'List of feed items, each containing post details + media + reaction/comment/save/inquiry counts.',
  })
  getFeed(
    @CurrentUser() user: User,
    @Query('limit') limit?: string,
    @Query('skip') skip?: string,
  ) {
    return this.feedsService.getFeed(user._id ?? user.id ?? '', {
      limit: limit ? Number(limit) : undefined,
      skip: skip ? Number(skip) : undefined,
    });
  }

  @Post('regenerate')
  @ApiOperation({
    summary:
      "Rebuild the current user's feed from active posts. Agents get listings + requirements; users get listings only. Score is set to 0 — replace with real scoring later.",
  })
  regenerate(@CurrentUser() user: User) {
    return this.feedsService.regenerate(user._id ?? user.id ?? '', user.type);
  }
}
