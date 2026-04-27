import { Queue } from 'bullmq';
import { UsersService } from '../users/users.service';
import { OtpService } from './services/otp.service';
import { AuthTokenService } from './services/token.service';
import { RegisterDto, LoginDto, VerifyOtpDto, RefreshTokenDto, ResendOtpDto } from './dto/auth.dto';
import { User } from '../users/schemas/user.schema';
import { SendOtpSmsJobData } from '../queues/queue.constants';
export interface AuthResponse {
    user: User;
    access_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
}
export declare class AuthService {
    private usersService;
    private otpService;
    private tokenService;
    private readonly otpSmsQueue;
    constructor(usersService: UsersService, otpService: OtpService, tokenService: AuthTokenService, otpSmsQueue: Queue<SendOtpSmsJobData>);
    private enqueueOtpSms;
    register(registerDto: RegisterDto): Promise<{
        phone: string;
        message: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        phone: string;
        message: string;
    }>;
    verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<AuthResponse>;
    verifyRegistrationOtp(verifyOtpDto: VerifyOtpDto): Promise<AuthResponse>;
    resendOtp(resendOtpDto: ResendOtpDto): Promise<{
        phone: string;
        message: string;
    }>;
    refreshAccessToken(refreshTokenDto: RefreshTokenDto): {
        access_token: string;
        expires_in: number;
    };
    validateJwtPayload(payload: {
        sub: string;
    }): Promise<User | null>;
}
