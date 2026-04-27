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
import { ReactionsService } from './reactions.service';
import { CreateReactionDto } from './dto/create-reaction.dto';

@ApiTags('Reactions')
@Controller('posts/:post_id/reactions')
export class ReactionsController {
  constructor(private readonly reactionsService: ReactionsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({
    summary: 'Add or update a reaction (like/interested) on a post',
  })
  @ApiResponse({ status: 201, description: 'Reaction recorded' })
  upsert(
    @Param('post_id') post_id: string,
    @CurrentUser() user: User,
    @Body() dto: CreateReactionDto,
  ) {
    return this.reactionsService.upsert(
      user._id ?? user.id ?? '',
      post_id,
      dto.type,
    );
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({ summary: 'Remove your reaction from a post' })
  remove(@Param('post_id') post_id: string, @CurrentUser() user: User) {
    return this.reactionsService.remove(user._id ?? user.id ?? '', post_id);
  }

  @Get()
  @ApiOperation({ summary: 'List reactions on a post' })
  findByPost(@Param('post_id') post_id: string) {
    return this.reactionsService.findByPost(post_id);
  }

  @Get('counts')
  @ApiOperation({ summary: 'Reaction counts grouped by type' })
  counts(@Param('post_id') post_id: string) {
    return this.reactionsService.countsByPost(post_id);
  }
}
