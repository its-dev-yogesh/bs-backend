import { Model } from 'mongoose';
import { Otp, OtpType } from '../schemas/otp.schema';
export declare class OtpService {
    private otpModel;
    constructor(otpModel: Model<Otp>);
    generateOtpCode(): string;
    createOtp(email: string, type: OtpType, metadata?: Record<string, any>): Promise<Otp>;
    verifyOtp(email: string, otp_code: string, type: OtpType): Promise<{
        valid: boolean;
        message: string;
        otp?: Otp;
    }>;
    markAsUsed(email: string, type: OtpType): Promise<void>;
    getLatestOtp(email: string, type: OtpType): Promise<Otp | null>;
    isOtpValid(email: string, type: OtpType): Promise<boolean>;
    cleanupExpiredOtps(): Promise<void>;
}
