import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';
import { ReviewKycDto, SubmitKycDto } from './dto/kyc.dto';
import { KycRequest, KycStatus } from './schemas/kyc-request.schema';

@Injectable()
export class VerificationService {
  constructor(
    @InjectModel(KycRequest.name) private readonly kycModel: Model<KycRequest>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async submit(userId: string, dto: SubmitKycDto) {
    const existing = await this.kycModel.findOne({ user_id: userId }).exec();
    if (existing) {
      existing.pan_number = dto.panNumber;
      existing.aadhaar_number = dto.aadhaarNumber;
      existing.pan_doc_url = dto.panDocUrl;
      existing.aadhaar_doc_url = dto.aadhaarDocUrl;
      existing.status = KycStatus.PENDING;
      existing.admin_note = undefined;
      await existing.save();
      return { data: existing };
    }
    const created = await this.kycModel.create({
      user_id: userId,
      pan_number: dto.panNumber,
      aadhaar_number: dto.aadhaarNumber,
      pan_doc_url: dto.panDocUrl,
      aadhaar_doc_url: dto.aadhaarDocUrl,
      status: KycStatus.PENDING,
    });
    return { data: created };
  }

  async myStatus(userId: string) {
    const item = await this.kycModel.findOne({ user_id: userId }).exec();
    return { data: item };
  }

  async listPending() {
    const items = await this.kycModel
      .find({ status: KycStatus.PENDING })
      .sort({ createdAt: 1 })
      .exec();
    return { data: items };
  }

  async review(id: string, dto: ReviewKycDto) {
    const item = await this.kycModel.findById(id).exec();
    if (!item) throw new NotFoundException('KYC request not found');
    item.status = dto.status;
    item.admin_note = dto.adminNote;
    await item.save();

    if (dto.status === KycStatus.APPROVED) {
      await this.userModel
        .updateOne({ _id: item.user_id }, { $set: { is_verified: true } })
        .exec();
    }
    return { data: item };
  }
}
