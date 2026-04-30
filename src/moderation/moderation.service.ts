import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateReportDto, ReviewReportDto } from './dto/report.dto';
import { Report, ReportStatus } from './schemas/report.schema';

@Injectable()
export class ModerationService {
  constructor(
    @InjectModel(Report.name) private readonly reportModel: Model<Report>,
  ) {}

  async create(userId: string, dto: CreateReportDto) {
    const report = await this.reportModel.create({
      reporter_user_id: userId,
      target_type: dto.targetType,
      target_id: dto.targetId,
      reason: dto.reason,
      status: ReportStatus.OPEN,
    });
    return { data: report };
  }

  async listOpen() {
    const reports = await this.reportModel
      .find({ status: ReportStatus.OPEN })
      .sort({ createdAt: 1 })
      .exec();
    return { data: reports };
  }

  async listAll() {
    const reports = await this.reportModel
      .find()
      .sort({ createdAt: -1 })
      .exec();
    return { data: reports };
  }

  async review(id: string, dto: ReviewReportDto) {
    const report = await this.reportModel.findById(id).exec();
    if (!report) throw new NotFoundException('Report not found');
    report.status = dto.status;
    report.action_note = dto.note;
    await report.save();
    return { data: report };
  }
}
