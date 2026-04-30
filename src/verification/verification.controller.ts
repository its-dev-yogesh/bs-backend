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
import { ReviewKycDto, SubmitKycDto } from './dto/kyc.dto';
import { VerificationService } from './verification.service';

@ApiTags('Verification')
@Controller('verification')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('jwt-auth')
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @Post('kyc')
  submit(@CurrentUser() user: User, @Body() dto: SubmitKycDto) {
    return this.verificationService.submit(user._id ?? '', dto);
  }

  @Get('kyc/me')
  me(@CurrentUser() user: User) {
    return this.verificationService.myStatus(user._id ?? '');
  }

  @Get('kyc/pending')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  pending() {
    return this.verificationService.listPending();
  }

  @Get('kyc/all')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  all() {
    return this.verificationService.listAll();
  }

  @Put('kyc/:id/review')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  review(@Param('id') id: string, @Body() dto: ReviewKycDto) {
    return this.verificationService.review(id, dto);
  }
}
