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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const users_service_1 = require("../users/users.service");
const otp_service_1 = require("./services/otp.service");
const token_service_1 = require("./services/token.service");
const otp_schema_1 = require("./schemas/otp.schema");
const queue_constants_1 = require("../queues/queue.constants");
let AuthService = class AuthService {
    usersService;
    otpService;
    tokenService;
    otpSmsQueue;
    constructor(usersService, otpService, tokenService, otpSmsQueue) {
        this.usersService = usersService;
        this.otpService = otpService;
        this.tokenService = tokenService;
        this.otpSmsQueue = otpSmsQueue;
    }
    async enqueueOtpSms(phone, otp_code, otp_type) {
        await this.otpSmsQueue.add(queue_constants_1.JOB_SEND_OTP_SMS, { phone, otp_code, otp_type }, {
            attempts: 3,
            backoff: { type: 'exponential', delay: 5000 },
            removeOnComplete: 100,
            removeOnFail: 500,
        });
    }
    async register(registerDto) {
        const existingUser = await this.usersService.findByPhone(registerDto.phone);
        if (existingUser) {
            throw new common_1.BadRequestException('Phone number already registered');
        }
        await this.usersService.create({
            username: registerDto.username,
            phone: registerDto.phone,
            email: registerDto.email,
            password: registerDto.password,
        });
        const otp = await this.otpService.createOtp(registerDto.phone, otp_schema_1.OtpType.REGISTRATION, { username: registerDto.username });
        await this.enqueueOtpSms(registerDto.phone, otp.otp_code, otp_schema_1.OtpType.REGISTRATION);
        return {
            phone: registerDto.phone,
            message: 'Registration successful. Check your phone for OTP.',
        };
    }
    async login(loginDto) {
        const user = await this.usersService.findByPhone(loginDto.phone);
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const otp = await this.otpService.createOtp(loginDto.phone, otp_schema_1.OtpType.LOGIN, {
            user_id: user._id,
        });
        await this.enqueueOtpSms(loginDto.phone, otp.otp_code, otp_schema_1.OtpType.LOGIN);
        return {
            phone: loginDto.phone,
            message: 'OTP sent to your phone. Please verify to complete login.',
        };
    }
    async verifyOtp(verifyOtpDto) {
        const otpResult = await this.otpService.verifyOtp(verifyOtpDto.phone, verifyOtpDto.otp_code, otp_schema_1.OtpType.LOGIN);
        if (!otpResult.valid) {
            throw new common_1.BadRequestException(otpResult.message);
        }
        const user = await this.usersService.findByPhone(verifyOtpDto.phone);
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        await this.otpService.markAsUsed(verifyOtpDto.phone, otp_schema_1.OtpType.LOGIN);
        const userId = user._id?.toString() || user.id || 'unknown';
        const tokens = this.tokenService.generateTokens({
            sub: userId,
            username: user.username,
            email: user.email ?? '',
            type: user.type,
        });
        return {
            user,
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            expires_in: 900,
            token_type: 'Bearer',
        };
    }
    async verifyRegistrationOtp(verifyOtpDto) {
        const otpResult = await this.otpService.verifyOtp(verifyOtpDto.phone, verifyOtpDto.otp_code, otp_schema_1.OtpType.REGISTRATION);
        if (!otpResult.valid) {
            throw new common_1.BadRequestException(otpResult.message);
        }
        const user = await this.usersService.findByPhone(verifyOtpDto.phone);
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const userId = user._id?.toString() || user.id || 'unknown';
        await this.usersService.update(userId, {
            username: user.username,
            phone: user.phone,
        });
        await this.otpService.markAsUsed(verifyOtpDto.phone, otp_schema_1.OtpType.REGISTRATION);
        const tokens = this.tokenService.generateTokens({
            sub: userId,
            username: user.username,
            email: user.email ?? '',
            type: user.type,
        });
        return {
            user,
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            expires_in: 900,
            token_type: 'Bearer',
        };
    }
    async resendOtp(resendOtpDto) {
        const user = await this.usersService.findByPhone(resendOtpDto.phone);
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const otp = await this.otpService.createOtp(resendOtpDto.phone, otp_schema_1.OtpType.LOGIN, { user_id: user._id });
        await this.enqueueOtpSms(resendOtpDto.phone, otp.otp_code, otp_schema_1.OtpType.LOGIN);
        return {
            phone: resendOtpDto.phone,
            message: 'OTP resent to your phone.',
        };
    }
    refreshAccessToken(refreshTokenDto) {
        const result = this.tokenService.refreshAccessToken(refreshTokenDto.refresh_token);
        if (!result) {
            throw new common_1.UnauthorizedException('Invalid or expired refresh token');
        }
        return {
            access_token: result.access_token,
            expires_in: 900,
        };
    }
    async validateJwtPayload(payload) {
        const user = await this.usersService.findById(payload.sub);
        return user || null;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, bullmq_1.InjectQueue)(queue_constants_1.QUEUE_PHONE_OTP)),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        otp_service_1.OtpService,
        token_service_1.AuthTokenService,
        bullmq_2.Queue])
], AuthService);
//# sourceMappingURL=auth.service.js.map