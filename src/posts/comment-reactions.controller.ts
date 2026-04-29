import { Controller, Delete, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/schemas/user.schema';
import { CommentReactionsService } from './comment-reactions.service';

@ApiTags('Comments')
@Controller('comments/:comment_id/reactions')
export class CommentReactionsController {
  constructor(private readonly service: CommentReactionsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({ summary: 'Like a comment' })
  like(@Param('comment_id') comment_id: string, @CurrentUser() user: User) {
    return this.service.like(user._id ?? user.id ?? '', comment_id);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({ summary: 'Remove your like from a comment' })
  unlike(@Param('comment_id') comment_id: string, @CurrentUser() user: User) {
    return this.service.unlike(user._id ?? user.id ?? '', comment_id);
  }
}
