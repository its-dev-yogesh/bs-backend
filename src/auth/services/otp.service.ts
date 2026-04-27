import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Otp, OtpStatus, OtpType } from '../schemas/otp.schema';

/**
 * Hardcoded OTP used while we wire up Brevo SMS. Every code generated is
 * "123456" so it's trivial to test login flows without a real SMS provider.
 * Replace generateOtpCode() with a random generator once Brevo is plumbed in.
 */
const STUB_OTP_CODE = '123456';

@Injectable()
export class OtpService {
  constructor(@InjectModel(Otp.name) private otpModel: Model<Otp>) {}

  generateOtpCode(): string {
    return STUB_OTP_CODE;
  }

  /**
   * Create and save OTP to database, keyed by phone number.
   */
  async createOtp(
    phone: string,
    type: OtpType,
    metadata?: Record<string, any>,
  ): Promise<Otp> {
    // Invalidate previous pending OTPs for this phone+type
    await this.otpModel.updateMany(
      { phone, type, status: OtpStatus.PENDING },
      { status: OtpStatus.EXPIRED },
    );

    const otp_code = this.generateOtpCode();
    const expires_at = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const otp = new this.otpModel({
      phone,
      otp_code,
      type,
      status: OtpStatus.PENDING,
      expires_at,
      attempts: 0,
      max_attempts: 3,
      metadata,
    });

    return otp.save();
  }

  async verifyOtp(
    phone: string,
    otp_code: string,
    type: OtpType,
  ): Promise<{ valid: boolean; message: string; otp?: Otp }> {
    const otp = await this.otpModel.findOne({
      phone,
      type,
      status: OtpStatus.PENDING,
    });

    if (!otp) {
      return { valid: false, message: 'OTP not found or expired' };
    }

    if (new Date() > otp.expires_at) {
      await this.otpModel.updateOne(
        { _id: otp._id },
        { status: OtpStatus.EXPIRED },
      );
      return { valid: false, message: 'OTP has expired' };
    }

    if (otp.attempts >= otp.max_attempts) {
      await this.otpModel.updateOne(
        { _id: otp._id },
        { status: OtpStatus.EXPIRED },
      );
      return { valid: false, message: 'Maximum attempts exceeded' };
    }

    if (otp.otp_code !== otp_code) {
      await this.otpModel.updateOne(
        { _id: otp._id },
        { attempts: otp.attempts + 1 },
      );
      return {
        valid: false,
        message: `Invalid OTP. ${otp.max_attempts - otp.attempts - 1} attempts remaining`,
      };
    }

    await this.otpModel.updateOne(
      { _id: otp._id },
      { status: OtpStatus.VERIFIED },
    );
    return { valid: true, message: 'OTP verified successfully', otp };
  }

  async markAsUsed(phone: string, type: OtpType): Promise<void> {
    await this.otpModel.updateOne(
      { phone, type, status: OtpStatus.VERIFIED },
      { status: OtpStatus.USED },
    );
  }

  async getLatestOtp(phone: string, type: OtpType): Promise<Otp | null> {
    return this.otpModel
      .findOne({ phone, type })
      .sort({ createdAt: -1 })
      .exec();
  }

  async isOtpValid(phone: string, type: OtpType): Promise<boolean> {
    const otp = await this.getLatestOtp(phone, type);
    if (!otp) return false;
    if (otp.status !== OtpStatus.VERIFIED) return false;
    if (new Date() > otp.expires_at) return false;
    return true;
  }

  async cleanupExpiredOtps(): Promise<void> {
    await this.otpModel.deleteMany({
      expires_at: { $lt: new Date() },
      status: { $in: [OtpStatus.EXPIRED, OtpStatus.USED] },
    });
  }
}
