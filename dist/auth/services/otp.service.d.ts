import { Model } from 'mongoose';
import { Otp, OtpType } from '../schemas/otp.schema';
export declare class OtpService {
    private otpModel;
    constructor(otpModel: Model<Otp>);
    generateOtpCode(): string;
    createOtp(phone: string, type: OtpType, metadata?: Record<string, any>): Promise<Otp>;
    verifyOtp(phone: string, otp_code: string, type: OtpType): Promise<{
        valid: boolean;
        message: string;
        otp?: Otp;
    }>;
    markAsUsed(phone: string, type: OtpType): Promise<void>;
    getLatestOtp(phone: string, type: OtpType): Promise<Otp | null>;
    isOtpValid(phone: string, type: OtpType): Promise<boolean>;
    cleanupExpiredOtps(): Promise<void>;
}
