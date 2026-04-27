"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const otp_schema_1 = require("../schemas/otp.schema");
const STUB_OTP_CODE = '123456';
let OtpService = class OtpService {
    otpModel;
    constructor(otpModel) {
        this.otpModel = otpModel;
    }
    generateOtpCode() {
        return STUB_OTP_CODE;
    }
    async createOtp(phone, type, metadata) {
        await this.otpModel.updateMany({ phone, type, status: otp_schema_1.OtpStatus.PENDING }, { status: otp_schema_1.OtpStatus.EXPIRED });
        const otp_code = this.generateOtpCode();
        const expires_at = new Date(Date.now() + 10 * 60 * 1000);
        const otp = new this.otpModel({
            phone,
            otp_code,
            type,
            status: otp_schema_1.OtpStatus.PENDING,
            expires_at,
            attempts: 0,
            max_attempts: 3,
            metadata,
        });
        return otp.save();
    }
    async verifyOtp(phone, otp_code, type) {
        const otp = await this.otpModel.findOne({
            phone,
            type,
            status: otp_schema_1.OtpStatus.PENDING,
        });
        if (!otp) {
            return { valid: false, message: 'OTP not found or expired' };
        }
        if (new Date() > otp.expires_at) {
            await this.otpModel.updateOne({ _id: otp._id }, { status: otp_schema_1.OtpStatus.EXPIRED });
            return { valid: false, message: 'OTP has expired' };
        }
        if (otp.attempts >= otp.max_attempts) {
            await this.otpModel.updateOne({ _id: otp._id }, { status: otp_schema_1.OtpStatus.EXPIRED });
            return { valid: false, message: 'Maximum attempts exceeded' };
        }
        if (otp.otp_code !== otp_code) {
            await this.otpModel.updateOne({ _id: otp._id }, { attempts: otp.attempts + 1 });
            return {
                valid: false,
                message: `Invalid OTP. ${otp.max_attempts - otp.attempts - 1} attempts remaining`,
            };
        }
        await this.otpModel.updateOne({ _id: otp._id }, { status: otp_schema_1.OtpStatus.VERIFIED });
        return { valid: true, message: 'OTP verified successfully', otp };
    }
    async markAsUsed(phone, type) {
        await this.otpModel.updateOne({ phone, type, status: otp_schema_1.OtpStatus.VERIFIED }, { status: otp_schema_1.OtpStatus.USED });
    }
    async getLatestOtp(phone, type) {
        return this.otpModel
            .findOne({ phone, type })
            .sort({ createdAt: -1 })
            .exec();
    }
    async isOtpValid(phone, type) {
        const otp = await this.getLatestOtp(phone, type);
        if (!otp)
            return false;
        if (otp.status !== otp_schema_1.OtpStatus.VERIFIED)
            return false;
        if (new Date() > otp.expires_at)
            return false;
        return true;
    }
    async cleanupExpiredOtps() {
        await this.otpModel.deleteMany({
            expires_at: { $lt: new Date() },
            status: { $in: [otp_schema_1.OtpStatus.EXPIRED, otp_schema_1.OtpStatus.USED] },
        });
    }
};
exports.OtpService = OtpService;
exports.OtpService = OtpService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(otp_schema_1.Otp.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], OtpService);
//# sourceMappingURL=otp.service.js.map