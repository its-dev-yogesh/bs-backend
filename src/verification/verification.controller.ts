import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../users/schemas/user.schema';
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
  pending() {
    return this.verificationService.listPending();
  }

  @Put('kyc/:id/review')
  review(@Param('id') id: string, @Body() dto: ReviewKycDto) {
    return this.verificationService.review(id, dto);
  }
}
