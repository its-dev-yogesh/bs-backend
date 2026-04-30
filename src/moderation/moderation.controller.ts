import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { User, UserRole } from '../users/schemas/user.schema';
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
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  open() {
    return this.moderationService.listOpen();
  }

  @Get('reports/all')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  all() {
    return this.moderationService.listAll();
  }

  @Put('reports/:id/review')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  review(@Param('id') id: string, @Body() dto: ReviewReportDto) {
    return this.moderationService.review(id, dto);
  }
}
