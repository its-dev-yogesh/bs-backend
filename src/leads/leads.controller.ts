import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../users/schemas/user.schema';
import { CreateLeadDto, UpdateLeadStatusDto } from './dto/create-lead.dto';
import { LeadsService } from './leads.service';

@ApiTags('Leads')
@Controller('leads')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('jwt-auth')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  create(@CurrentUser() user: User, @Body() dto: CreateLeadDto) {
    return this.leadsService.create(user._id ?? '', dto);
  }

  @Get()
  list(@CurrentUser() user: User) {
    return this.leadsService.listForUser(user._id ?? '');
  }

  @Put(':id/status')
  update(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() dto: UpdateLeadStatusDto,
  ) {
    return this.leadsService.updateStatus(user._id ?? '', id, dto);
  }
}
