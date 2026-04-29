import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../users/schemas/user.schema';
import { CreateReportDto, ReviewReportDto } from './dto/report.dto';
import { ModerationService } from './moderation.service';

@ApiTags('Moderation')
@Controller('moderation')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('jwt-auth')
export class ModerationController {
  constructor(private readonly moderationService: ModerationService) {}

  @Post('reports')
  report(@CurrentUser() user: User, @Body() dto: CreateReportDto) {
    return this.moderationService.create(user._id ?? '', dto);
  }

  @Get('reports/open')
  open() {
    return this.moderationService.listOpen();
  }

  @Put('reports/:id/review')
  review(@Param('id') id: string, @Body() dto: ReviewReportDto) {
    return this.moderationService.review(id, dto);
  }
}
