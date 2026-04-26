import { UsersService } from '../users/users.service';
import { OtpService } from './services/otp.service';
import { AuthTokenService } from './services/token.service';
import { RegisterDto, LoginDto, VerifyOtpDto, RefreshTokenDto, ResendOtpDto } from './dto/auth.dto';
import { User } from '../users/schemas/user.schema';
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
    constructor(usersService: UsersService, otpService: OtpService, tokenService: AuthTokenService);
    register(registerDto: RegisterDto): Promise<{
        email: string;
        message: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        email: string;
        message: string;
    }>;
    verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<AuthResponse>;
    verifyRegistrationOtp(verifyOtpDto: VerifyOtpDto): Promise<AuthResponse>;
    resendOtp(resendOtpDto: ResendOtpDto): Promise<{
        email: string;
        message: string;
    }>;
    refreshAccessToken(refreshTokenDto: RefreshTokenDto): Promise<{
        access_token: string;
        expires_in: number;
    }>;
    validateJwtPayload(payload: any): Promise<User | null>;
}
