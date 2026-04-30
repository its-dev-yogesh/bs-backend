import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { UsersService } from '../users/users.service';
import { OtpService } from './services/otp.service';
import { AuthTokenService } from './services/token.service';
import {
  RegisterDto,
  LoginDto,
  VerifyOtpDto,
  RefreshTokenDto,
  ResendOtpDto,
} from './dto/auth.dto';
import { OtpType } from './schemas/otp.schema';
import { User } from '../users/schemas/user.schema';
import {
  JOB_SEND_OTP_SMS,
  QUEUE_PHONE_OTP,
  SendOtpSmsJobData,
} from '../queues/queue.constants';

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
    @InjectQueue(QUEUE_PHONE_OTP)
    private readonly otpSmsQueue: Queue<SendOtpSmsJobData>,
  ) {}

  private async enqueueOtpSms(
    phone: string,
    otp_code: string,
    otp_type: OtpType,
  ) {
    await this.otpSmsQueue.add(
      JOB_SEND_OTP_SMS,
      { phone, otp_code, otp_type },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
        removeOnComplete: 100,
        removeOnFail: 500,
      },
    );
  }

  /**
   * Register a new user. Phone is the OTP target; email is optional.
   */
  async register(
    registerDto: RegisterDto,
  ): Promise<{ phone: string; message: string }> {
    const existingUser = await this.usersService.findByPhone(registerDto.phone);
    if (existingUser) {
      throw new BadRequestException('Phone number already registered');
    }

    await this.usersService.create({
      username: registerDto.username,
      phone: registerDto.phone,
      email: registerDto.email,
      password: registerDto.password,
    });

    const otp = await this.otpService.createOtp(
      registerDto.phone,
      OtpType.REGISTRATION,
      { username: registerDto.username },
    );

    await this.enqueueOtpSms(
      registerDto.phone,
      otp.otp_code,
      OtpType.REGISTRATION,
    );

    return {
      phone: registerDto.phone,
      message: 'Registration successful. Check your phone for OTP.',
    };
  }

  /**
   * Initiate login by phone (OTP-based).
   */
  async login(loginDto: LoginDto): Promise<{ phone: string; message: string }> {
    const user = await this.usersService.findByPhone(loginDto.phone);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const otp = await this.otpService.createOtp(loginDto.phone, OtpType.LOGIN, {
      user_id: user._id,
    });

    await this.enqueueOtpSms(loginDto.phone, otp.otp_code, OtpType.LOGIN);

    return {
      phone: loginDto.phone,
      message: 'OTP sent to your phone. Please verify to complete login.',
    };
  }

  /**
   * Verify login OTP and complete authentication.
   */
  async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<AuthResponse> {
    const otpResult = await this.otpService.verifyOtp(
      verifyOtpDto.phone,
      verifyOtpDto.otp_code,
      OtpType.LOGIN,
    );

    if (!otpResult.valid) {
      throw new BadRequestException(otpResult.message);
    }

    const user = await this.usersService.findByPhone(verifyOtpDto.phone);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    await this.otpService.markAsUsed(verifyOtpDto.phone, OtpType.LOGIN);

    const userId = user._id?.toString() || user.id || 'unknown';
    const tokens = this.tokenService.generateTokens({
      sub: userId,
      username: user.username,
      email: user.email ?? '',
      type: user.type,
      role: user.role,
    });

    return {
      user,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_in: 900,
      token_type: 'Bearer',
    };
  }

  /**
   * Verify registration OTP.
   */
  async verifyRegistrationOtp(
    verifyOtpDto: VerifyOtpDto,
  ): Promise<AuthResponse> {
    const otpResult = await this.otpService.verifyOtp(
      verifyOtpDto.phone,
      verifyOtpDto.otp_code,
      OtpType.REGISTRATION,
    );

    if (!otpResult.valid) {
      throw new BadRequestException(otpResult.message);
    }

    const user = await this.usersService.findByPhone(verifyOtpDto.phone);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const userId = user._id?.toString() || user.id || 'unknown';
    await this.usersService.update(userId, {
      username: user.username,
      phone: user.phone,
    });

    await this.otpService.markAsUsed(verifyOtpDto.phone, OtpType.REGISTRATION);

    const tokens = this.tokenService.generateTokens({
      sub: userId,
      username: user.username,
      email: user.email ?? '',
      type: user.type,
      role: user.role,
    });

    return {
      user,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_in: 900,
      token_type: 'Bearer',
    };
  }

  /**
   * Resend OTP.
   */
  async resendOtp(
    resendOtpDto: ResendOtpDto,
  ): Promise<{ phone: string; message: string }> {
    const user = await this.usersService.findByPhone(resendOtpDto.phone);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const otp = await this.otpService.createOtp(
      resendOtpDto.phone,
      OtpType.LOGIN,
      { user_id: user._id },
    );

    await this.enqueueOtpSms(resendOtpDto.phone, otp.otp_code, OtpType.LOGIN);

    return {
      phone: resendOtpDto.phone,
      message: 'OTP resent to your phone.',
    };
  }

  /**
   * Refresh access token.
   */
  refreshAccessToken(refreshTokenDto: RefreshTokenDto): {
    access_token: string;
    expires_in: number;
  } {
    const result = this.tokenService.refreshAccessToken(
      refreshTokenDto.refresh_token,
    );

    if (!result) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    return {
      access_token: result.access_token,
      expires_in: 900,
    };
  }

  /**
   * Validate JWT payload (used by Passport JWT strategy).
   */
  async validateJwtPayload(payload: { sub: string }): Promise<User | null> {
    const user = await this.usersService.findById(payload.sub);
    return user || null;
  }
}
