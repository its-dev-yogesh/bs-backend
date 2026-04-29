import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
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
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({
    summary:
      'List comments on a post (threaded, with like counts; likes marked when Bearer token sent)',
  })
  findByPost(
    @Param('post_id') post_id: string,
    @Req() req: Request & { user?: User },
  ) {
    const uid = req.user?._id ?? req.user?.id;
    return this.commentsService.findByPostThreaded(
      post_id,
      uid ? String(uid) : undefined,
    );
  }

  @Post('comments/:comment_id/like')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({ summary: 'Like a comment' })
  likeComment(
    @Param('comment_id') comment_id: string,
    @CurrentUser() user: User,
  ) {
    return this.commentsService.likeComment(
      user._id ?? user.id ?? '',
      comment_id,
    );
  }

  @Delete('comments/:comment_id/like')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({ summary: 'Remove like from a comment' })
  unlikeComment(
    @Param('comment_id') comment_id: string,
    @CurrentUser() user: User,
  ) {
    return this.commentsService.unlikeComment(
      user._id ?? user.id ?? '',
      comment_id,
    );
  }

  @Get('comments/:comment_id/replies')
  @ApiOperation({ summary: 'List direct replies to a comment' })
  findReplies(@Param('comment_id') comment_id: string) {
    return this.commentsService.findReplies(comment_id);
  }

  @Delete('comments/:comment_id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({ summary: 'Delete a comment (author only)' })
  remove(@Param('comment_id') comment_id: string, @CurrentUser() user: User) {
    return this.commentsService.remove(comment_id, user._id ?? user.id ?? '');
  }
}
