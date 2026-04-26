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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const otp_service_1 = require("./services/otp.service");
const token_service_1 = require("./services/token.service");
const otp_schema_1 = require("./schemas/otp.schema");
let AuthService = class AuthService {
    usersService;
    otpService;
    tokenService;
    constructor(usersService, otpService, tokenService) {
        this.usersService = usersService;
        this.otpService = otpService;
        this.tokenService = tokenService;
    }
    async register(registerDto) {
        const existingUser = await this.usersService.findByEmail(registerDto.email);
        if (existingUser) {
            throw new common_1.BadRequestException('Email already registered');
        }
        const user = await this.usersService.create({
            username: registerDto.username,
            email: registerDto.email,
            password: registerDto.password,
            phone: registerDto.phone,
        });
        const otp = await this.otpService.createOtp(registerDto.email, otp_schema_1.OtpType.REGISTRATION, { username: registerDto.username });
        console.log(`[OTP] Registration OTP for ${registerDto.email}: ${otp.otp_code}`);
        return {
            email: registerDto.email,
            message: 'Registration successful. Check your email for OTP.',
        };
    }
    async login(loginDto) {
        const user = await this.usersService.findByEmail(loginDto.email);
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const otp = await this.otpService.createOtp(loginDto.email, otp_schema_1.OtpType.LOGIN, { user_id: user._id });
        console.log(`[OTP] Login OTP for ${loginDto.email}: ${otp.otp_code}`);
        return {
            email: loginDto.email,
            message: 'OTP sent to your email. Please verify to complete login.',
        };
    }
    async verifyOtp(verifyOtpDto) {
        const otpResult = await this.otpService.verifyOtp(verifyOtpDto.email, verifyOtpDto.otp_code, otp_schema_1.OtpType.LOGIN);
        if (!otpResult.valid) {
            throw new common_1.BadRequestException(otpResult.message);
        }
        const user = await this.usersService.findByEmail(verifyOtpDto.email);
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        await this.otpService.markAsUsed(verifyOtpDto.email, otp_schema_1.OtpType.LOGIN);
        const userId = user._id?.toString() || user.id || 'unknown';
        const tokens = this.tokenService.generateTokens({
            sub: userId,
            username: user.username,
            email: user.email,
            type: user.type,
        });
        return {
            user: user,
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            expires_in: 900,
            token_type: 'Bearer',
        };
    }
    async verifyRegistrationOtp(verifyOtpDto) {
        const otpResult = await this.otpService.verifyOtp(verifyOtpDto.email, verifyOtpDto.otp_code, otp_schema_1.OtpType.REGISTRATION);
        if (!otpResult.valid) {
            throw new common_1.BadRequestException(otpResult.message);
        }
        const user = await this.usersService.findByEmail(verifyOtpDto.email);
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const userId = user._id?.toString() || user.id || 'unknown';
        await this.usersService.update(userId, {
            username: user.username,
            email: user.email,
        });
        await this.otpService.markAsUsed(verifyOtpDto.email, otp_schema_1.OtpType.REGISTRATION);
        const tokens = this.tokenService.generateTokens({
            sub: userId,
            username: user.username,
            email: user.email,
            type: user.type,
        });
        return {
            user: user,
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            expires_in: 900,
            token_type: 'Bearer',
        };
    }
    async resendOtp(resendOtpDto) {
        const user = await this.usersService.findByEmail(resendOtpDto.email);
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const otp = await this.otpService.createOtp(resendOtpDto.email, otp_schema_1.OtpType.LOGIN, { user_id: user._id });
        console.log(`[OTP] Resent OTP for ${resendOtpDto.email}: ${otp.otp_code}`);
        return {
            email: resendOtpDto.email,
            message: 'OTP resent to your email.',
        };
    }
    async refreshAccessToken(refreshTokenDto) {
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
    __metadata("design:paramtypes", [users_service_1.UsersService,
        otp_service_1.OtpService,
        token_service_1.AuthTokenService])
], AuthService);
//# sourceMappingURL=auth.service.js.map