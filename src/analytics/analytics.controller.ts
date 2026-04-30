import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { User, UserRole, UserStatus } from '../users/schemas/user.schema';
import { Post, PostStatus } from '../posts/schemas/post.schema';
import { Lead, LeadStatus } from '../leads/schemas/lead.schema';
import {
  KycRequest,
  KycStatus,
} from '../verification/schemas/kyc-request.schema';
import { Report, ReportStatus } from '../moderation/schemas/report.schema';

@ApiTags('Analytics')
@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('jwt-auth')
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
export class AnalyticsController {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    @InjectModel(Lead.name) private readonly leadModel: Model<Lead>,
    @InjectModel(KycRequest.name)
    private readonly kycModel: Model<KycRequest>,
    @InjectModel(Report.name) private readonly reportModel: Model<Report>,
  ) {}

  @Get('dashboard')
  async dashboard() {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const [
      totalUsers,
      activeUsers,
      bannedUsers,
      newUsers24h,
      listingsActive,
      leadsTotal,
      leadsConverted,
      kycPending,
      reportsOpen,
    ] = await Promise.all([
      this.userModel.countDocuments().exec(),
      this.userModel.countDocuments({ status: UserStatus.ACTIVE }).exec(),
      this.userModel.countDocuments({ status: UserStatus.BANNED }).exec(),
      this.userModel.countDocuments({ createdAt: { $gte: since } }).exec(),
      this.postModel.countDocuments({ status: PostStatus.ACTIVE }).exec(),
      this.leadModel.countDocuments().exec(),
      this.leadModel.countDocuments({ status: LeadStatus.CONVERTED }).exec(),
      this.kycModel.countDocuments({ status: KycStatus.PENDING }).exec(),
      this.reportModel.countDocuments({ status: ReportStatus.OPEN }).exec(),
    ]);

    return {
      data: {
        totalUsers,
        activeUsers,
        bannedUsers,
        newUsers24h,
        listingsCount: listingsActive,
        leadVolume: leadsTotal,
        leadsConverted,
        pendingKyc: kycPending,
        openReports: reportsOpen,
      },
    };
  }
}
