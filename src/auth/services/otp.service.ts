import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Otp, OtpStatus, OtpType } from '../schemas/otp.schema';

@Injectable()
export class OtpService {
  constructor(@InjectModel(Otp.name) private otpModel: Model<Otp>) {}

  /**
   * Generate a random 6-digit OTP code
   */
  generateOtpCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Create and save OTP to database
   */
  async createOtp(
    email: string,
    type: OtpType,
    metadata?: Record<string, any>,
  ): Promise<Otp> {
    // Invalidate previous OTPs for this email
    await this.otpModel.updateMany(
      { email, type, status: OtpStatus.PENDING },
      { status: OtpStatus.EXPIRED },
    );

    const otp_code = this.generateOtpCode();
    const expires_at = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const otp = new this.otpModel({
      email,
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

  /**
   * Verify OTP code
   */
  async verifyOtp(
    email: string,
    otp_code: string,
    type: OtpType,
  ): Promise<{ valid: boolean; message: string; otp?: Otp }> {
    const otp = await this.otpModel.findOne({
      email,
      type,
      status: OtpStatus.PENDING,
    });

    if (!otp) {
      return { valid: false, message: 'OTP not found or expired' };
    }

    // Check if OTP has expired
    if (new Date() > otp.expires_at) {
      await this.otpModel.updateOne({ _id: otp._id }, { status: OtpStatus.EXPIRED });
      return { valid: false, message: 'OTP has expired' };
    }

    // Check if max attempts exceeded
    if (otp.attempts >= otp.max_attempts) {
      await this.otpModel.updateOne({ _id: otp._id }, { status: OtpStatus.EXPIRED });
      return { valid: false, message: 'Maximum attempts exceeded' };
    }

    // Verify code
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

    // Mark as verified
    await this.otpModel.updateOne({ _id: otp._id }, { status: OtpStatus.VERIFIED });
    return { valid: true, message: 'OTP verified successfully', otp };
  }

  /**
   * Mark OTP as used
   */
  async markAsUsed(email: string, type: OtpType): Promise<void> {
    await this.otpModel.updateOne(
      { email, type, status: OtpStatus.VERIFIED },
      { status: OtpStatus.USED },
    );
  }

  /**
   * Get latest OTP for email and type
   */
  async getLatestOtp(email: string, type: OtpType): Promise<Otp | null> {
    return this.otpModel
      .findOne({ email, type })
      .sort({ createdAt: -1 })
      .exec();
  }

  /**
   * Check if OTP is valid (not expired, correct status)
   */
  async isOtpValid(email: string, type: OtpType): Promise<boolean> {
    const otp = await this.getLatestOtp(email, type);

    if (!otp) {
      return false;
    }

    if (otp.status !== OtpStatus.VERIFIED) {
      return false;
    }

    if (new Date() > otp.expires_at) {
      return false;
    }

    return true;
  }

  /**
   * Clean up expired OTPs
   */
  async cleanupExpiredOtps(): Promise<void> {
    await this.otpModel.deleteMany({
      expires_at: { $lt: new Date() },
      status: { $in: [OtpStatus.EXPIRED, OtpStatus.USED] },
    });
  }
}
