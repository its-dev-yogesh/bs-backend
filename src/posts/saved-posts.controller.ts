import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/schemas/user.schema';
import { SavedPostsService } from './saved-posts.service';

@ApiTags('Saved Posts')
@Controller()
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('jwt-auth')
export class SavedPostsController {
  constructor(private readonly savedPostsService: SavedPostsService) {}

  @Post('posts/:post_id/save')
  @ApiOperation({ summary: 'Bookmark a post' })
  @ApiResponse({ status: 201, description: 'Post saved' })
  save(@Param('post_id') post_id: string, @CurrentUser() user: User) {
    return this.savedPostsService.save(user._id ?? user.id ?? '', post_id);
  }

  @Delete('posts/:post_id/save')
  @ApiOperation({ summary: 'Remove bookmark' })
  unsave(@Param('post_id') post_id: string, @CurrentUser() user: User) {
    return this.savedPostsService.unsave(user._id ?? user.id ?? '', post_id);
  }

  @Get('saved-posts')
  @ApiOperation({ summary: 'List my saved posts' })
  list(@CurrentUser() user: User) {
    return this.savedPostsService.listForUser(user._id ?? user.id ?? '');
  }

  @Get('posts/:post_id/saved')
  @ApiOperation({ summary: 'Check whether the current user saved this post' })
  isSaved(@Param('post_id') post_id: string, @CurrentUser() user: User) {
    return this.savedPostsService
      .isSaved(user._id ?? user.id ?? '', post_id)
      .then((saved) => ({ saved }));
  }
}
