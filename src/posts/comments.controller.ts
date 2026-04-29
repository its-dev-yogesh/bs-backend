import {
  Body,
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
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@ApiTags('Comments')
@Controller()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('posts/:post_id/comments')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({ summary: 'Add a comment (or reply via parent_id)' })
  @ApiResponse({ status: 201, description: 'Comment created' })
  create(
    @Param('post_id') post_id: string,
    @CurrentUser() user: User,
    @Body() dto: CreateCommentDto,
  ) {
    return this.commentsService.create(user._id ?? user.id ?? '', post_id, dto);
  }

  @Get('posts/:post_id/comments')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({
    summary:
      'List all comments on a post (flat). Each comment is enriched with like_count and is_liked for the requesting user.',
  })
  findByPost(@Param('post_id') post_id: string, @CurrentUser() user: User) {
    return this.commentsService.findByPost(post_id, user._id ?? user.id ?? '');
  }

  @Get('comments/:comment_id/replies')
  @ApiOperation({ summary: 'List direct replies to a comment' })
  findReplies(@Param('comment_id') comment_id: string) {
    return this.commentsService.findReplies(comment_id);
  }

  @Delete('comments/:comment_id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({
    summary: 'Delete a comment (comment author or post owner)',
  })
  remove(@Param('comment_id') comment_id: string, @CurrentUser() user: User) {
    return this.commentsService.remove(comment_id, user._id ?? user.id ?? '');
  }
}
