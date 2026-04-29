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
import { InquiriesService } from './inquiries.service';
import { CreateInquiryDto } from './dto/create-inquiry.dto';

@ApiTags('Inquiries')
@Controller()
export class InquiriesController {
  constructor(private readonly inquiriesService: InquiriesService) {}

  @Post('posts/:post_id/inquiries')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({
    summary:
      'Express interest in a post — creates a lead the post owner can act on',
  })
  @ApiResponse({ status: 201, description: 'Inquiry created (or updated)' })
  create(
    @Param('post_id') post_id: string,
    @CurrentUser() user: User,
    @Body() dto: CreateInquiryDto,
  ) {
    return this.inquiriesService.create(
      user._id ?? user.id ?? '',
      post_id,
      dto,
    );
  }

  @Delete('posts/:post_id/inquiries')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({ summary: 'Withdraw your inquiry on a post' })
  remove(@Param('post_id') post_id: string, @CurrentUser() user: User) {
    return this.inquiriesService.remove(user._id ?? user.id ?? '', post_id);
  }

  @Get('posts/:post_id/inquiries')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({
    summary:
      'List inquiries for this post (post owner only) — used for lead view',
  })
  listForPost(@Param('post_id') post_id: string, @CurrentUser() user: User) {
    return this.inquiriesService.listForPost(
      user._id ?? user.id ?? '',
      post_id,
    );
  }

  @Get('me/inquiries/sent')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({ summary: 'Inquiries the current user has sent' })
  listSent(@CurrentUser() user: User) {
    return this.inquiriesService.listSentByUser(user._id ?? user.id ?? '');
  }

  @Get('me/inquiries/received')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({
    summary: "Inquiries received across all of the current user's posts",
  })
  listReceived(@CurrentUser() user: User) {
    return this.inquiriesService.listReceivedByUser(user._id ?? user.id ?? '');
  }
}
