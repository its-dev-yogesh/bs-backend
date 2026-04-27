import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
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
import { PostsService } from './posts.service';
import {
  CreateListingPostDto,
  CreateRequirementPostDto,
  UpdatePostDto,
} from './dto/create-post.dto';
import { CreatePostMediaDto } from './dto/create-post-media.dto';
import { PostType } from './schemas/post.schema';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post('listings')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({ summary: 'Create a property listing (agents only)' })
  @ApiResponse({ status: 201, description: 'Listing post created' })
  @ApiResponse({ status: 403, description: 'Only agents can post listings' })
  createListing(@CurrentUser() user: User, @Body() dto: CreateListingPostDto) {
    return this.postsService.createListing(
      user._id ?? user.id ?? '',
      user.type,
      dto,
    );
  }

  @Post('requirements')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({ summary: 'Create a property requirement (users only)' })
  @ApiResponse({ status: 201, description: 'Requirement post created' })
  @ApiResponse({ status: 403, description: 'Only users can post requirements' })
  createRequirement(
    @CurrentUser() user: User,
    @Body() dto: CreateRequirementPostDto,
  ) {
    return this.postsService.createRequirement(
      user._id ?? user.id ?? '',
      user.type,
      dto,
    );
  }

  @Get()
  @ApiOperation({ summary: 'List posts' })
  @ApiQuery({ name: 'type', required: false, enum: PostType })
  @ApiQuery({ name: 'user_id', required: false })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  findAll(
    @Query('type') type?: PostType,
    @Query('user_id') user_id?: string,
    @Query('limit') limit?: string,
    @Query('skip') skip?: string,
  ) {
    return this.postsService.findAll({
      type,
      user_id,
      limit: limit ? Number(limit) : undefined,
      skip: skip ? Number(skip) : undefined,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a post with subtype + media' })
  findById(@Param('id') id: string) {
    return this.postsService.findById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({ summary: 'Update a post (author only)' })
  update(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body() dto: UpdatePostDto,
  ) {
    return this.postsService.update(id, user._id ?? user.id ?? '', dto);
  }

  @Put(':id/publish')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({
    summary: 'Publish a draft post (status -> active, triggers feed fan-out)',
  })
  publish(@Param('id') id: string, @CurrentUser() user: User) {
    return this.postsService.publish(id, user._id ?? user.id ?? '');
  }

  @Get('me/drafts')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({ summary: "List the current user's draft posts" })
  myDrafts(@CurrentUser() user: User) {
    return this.postsService.findDraftsByUser(user._id ?? user.id ?? '');
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({ summary: 'Delete a post (author only)' })
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.postsService.remove(id, user._id ?? user.id ?? '');
  }

  @Post(':id/media')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({ summary: 'Add media to a post' })
  addMedia(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body() dto: CreatePostMediaDto,
  ) {
    return this.postsService.addMedia(id, user._id ?? user.id ?? '', dto);
  }

  @Get(':id/media')
  @ApiOperation({ summary: 'List media for a post' })
  listMedia(@Param('id') id: string) {
    return this.postsService.listMedia(id);
  }

  @Delete('media/:media_id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({ summary: 'Delete a media item (post author only)' })
  removeMedia(@Param('media_id') media_id: string, @CurrentUser() user: User) {
    return this.postsService.removeMedia(media_id, user._id ?? user.id ?? '');
  }
}
