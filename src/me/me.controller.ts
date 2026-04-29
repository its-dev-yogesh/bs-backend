import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/schemas/user.schema';
import { MeService } from './me.service';

@ApiTags('Me')
@Controller('me')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('jwt-auth')
export class MeController {
  constructor(private readonly meService: MeService) {}

  @Get('insights')
  @ApiOperation({
    summary:
      'Aggregate insights for the current user: per-post engagement counts plus a global summary (followers/following + totals).',
  })
  insights(@CurrentUser() user: User) {
    return this.meService.getInsights(user._id ?? user.id ?? '');
  }
}
