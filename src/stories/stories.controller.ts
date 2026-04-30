import {
  Body,
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
import { StoriesService } from './stories.service';
import { CreateStoryDto } from './dto/create-story.dto';

@ApiTags('Stories')
@Controller('stories')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('jwt-auth')
export class StoriesController {
  constructor(private readonly storiesService: StoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a story (24h TTL)' })
  create(@CurrentUser() user: User, @Body() dto: CreateStoryDto) {
    return this.storiesService.create(user._id ?? user.id ?? '', dto);
  }

  @Get('feed')
  @ApiOperation({ summary: 'Active stories from current user + connections' })
  feed(@CurrentUser() user: User) {
    return this.storiesService.listFeed(user._id ?? user.id ?? '');
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete own story' })
  remove(@CurrentUser() user: User, @Param('id') id: string) {
    return this.storiesService.remove(user._id ?? user.id ?? '', id);
  }
}
