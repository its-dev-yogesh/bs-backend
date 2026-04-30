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

  @Get('admin/all')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  listAll() {
    return this.leadsService.listAll();
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
