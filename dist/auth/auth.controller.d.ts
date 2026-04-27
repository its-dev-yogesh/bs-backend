import { AuthService, AuthResponse } from './auth.service';
import { RegisterDto, LoginDto, VerifyOtpDto, RefreshTokenDto, ResendOtpDto } from './dto/auth.dto';
import { User } from '../users/schemas/user.schema';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        phone: string;
        message: string;
    }>;
    verifyRegistration(verifyOtpDto: VerifyOtpDto): Promise<AuthResponse>;
    login(loginDto: LoginDto): Promise<{
        phone: string;
        message: string;
    }>;
    verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<AuthResponse>;
    resendOtp(resendOtpDto: ResendOtpDto): Promise<{
        phone: string;
        message: string;
    }>;
    refreshToken(refreshTokenDto: RefreshTokenDto): {
        access_token: string;
        expires_in: number;
    };
    getCurrentUser(user: User): User;
    logout(): {
        message: string;
    };
}
