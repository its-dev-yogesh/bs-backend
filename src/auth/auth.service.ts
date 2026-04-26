import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { OtpService } from './services/otp.service';
import { AuthTokenService } from './services/token.service';
import { RegisterDto, LoginDto, VerifyOtpDto, RefreshTokenDto, ResendOtpDto } from './dto/auth.dto';
import { OtpType, OtpStatus } from './schemas/otp.schema';
import { User } from '../users/schemas/user.schema';
import * as bcrypt from 'bcrypt';

export interface AuthResponse {
  user: User;
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private otpService: OtpService,
    private tokenService: AuthTokenService,
  ) {}

  /**
   * Register a new user
   */
  async register(registerDto: RegisterDto): Promise<{ email: string; message: string }> {
    // Check if user already exists
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    // Create user
    const user = await this.usersService.create({
      username: registerDto.username,
      email: registerDto.email,
      password: registerDto.password,
      phone: registerDto.phone,
    });

    // Generate and send OTP
    const otp = await this.otpService.createOtp(
      registerDto.email,
      OtpType.REGISTRATION,
      { username: registerDto.username },
    );

    // TODO: Send OTP via email
    console.log(`[OTP] Registration OTP for ${registerDto.email}: ${otp.otp_code}`);

    return {
      email: registerDto.email,
      message: 'Registration successful. Check your email for OTP.',
    };
  }

  /**
   * Initiate login with email (OTP-based)
   */
  async login(loginDto: LoginDto): Promise<{ email: string; message: string }> {
    // Check if user exists
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Generate and send OTP
    const otp = await this.otpService.createOtp(
      loginDto.email,
      OtpType.LOGIN,
      { user_id: user._id },
    );

    // TODO: Send OTP via email
    console.log(`[OTP] Login OTP for ${loginDto.email}: ${otp.otp_code}`);

    return {
      email: loginDto.email,
      message: 'OTP sent to your email. Please verify to complete login.',
    };
  }

  /**
   * Verify OTP and complete authentication
   */
  async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<AuthResponse> {
    // Verify OTP
    const otpResult = await this.otpService.verifyOtp(
      verifyOtpDto.email,
      verifyOtpDto.otp_code,
      OtpType.LOGIN,
    );

    if (!otpResult.valid) {
      throw new BadRequestException(otpResult.message);
    }

    // Get user
    const user = await this.usersService.findByEmail(verifyOtpDto.email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Mark OTP as used
    await this.otpService.markAsUsed(verifyOtpDto.email, OtpType.LOGIN);

    // Generate tokens
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
      expires_in: 900, // 15 minutes in seconds
      token_type: 'Bearer',
    };
  }

  /**
   * Verify registration OTP
   */
  async verifyRegistrationOtp(verifyOtpDto: VerifyOtpDto): Promise<AuthResponse> {
    // Verify OTP
    const otpResult = await this.otpService.verifyOtp(
      verifyOtpDto.email,
      verifyOtpDto.otp_code,
      OtpType.REGISTRATION,
    );

    if (!otpResult.valid) {
      throw new BadRequestException(otpResult.message);
    }

    // Get user
    const user = await this.usersService.findByEmail(verifyOtpDto.email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Update user as verified
    const userId = user._id?.toString() || user.id || 'unknown';
    await this.usersService.update(userId, {
      username: user.username,
      email: user.email,
    });

    // Mark OTP as used
    await this.otpService.markAsUsed(verifyOtpDto.email, OtpType.REGISTRATION);

    // Generate tokens
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

  /**
   * Resend OTP
   */
  async resendOtp(resendOtpDto: ResendOtpDto): Promise<{ email: string; message: string }> {
    // Check if user exists
    const user = await this.usersService.findByEmail(resendOtpDto.email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Create new OTP
    const otp = await this.otpService.createOtp(
      resendOtpDto.email,
      OtpType.LOGIN,
      { user_id: user._id },
    );

    // TODO: Send OTP via email
    console.log(`[OTP] Resent OTP for ${resendOtpDto.email}: ${otp.otp_code}`);

    return {
      email: resendOtpDto.email,
      message: 'OTP resent to your email.',
    };
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken(refreshTokenDto: RefreshTokenDto): Promise<{ access_token: string; expires_in: number }> {
    const result = this.tokenService.refreshAccessToken(refreshTokenDto.refresh_token);

    if (!result) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    return {
      access_token: result.access_token,
      expires_in: 900, // 15 minutes
    };
  }

  /**
   * Validate JWT payload (used by Passport JWT strategy)
   */
  async validateJwtPayload(payload: any): Promise<User | null> {
    const user = await this.usersService.findById(payload.sub);
    return user || null;
  }
}
