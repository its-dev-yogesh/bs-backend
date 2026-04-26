import { AuthService, AuthResponse } from './auth.service';
import { RegisterDto, LoginDto, VerifyOtpDto, RefreshTokenDto, ResendOtpDto } from './dto/auth.dto';
import { User } from '../users/schemas/user.schema';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        email: string;
        message: string;
    }>;
    verifyRegistration(verifyOtpDto: VerifyOtpDto): Promise<AuthResponse>;
    login(loginDto: LoginDto): Promise<{
        email: string;
        message: string;
    }>;
    verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<AuthResponse>;
    resendOtp(resendOtpDto: ResendOtpDto): Promise<{
        email: string;
        message: string;
    }>;
    refreshToken(refreshTokenDto: RefreshTokenDto): Promise<{
        access_token: string;
        expires_in: number;
    }>;
    getCurrentUser(user: User): Promise<User>;
    logout(user: User): Promise<{
        message: string;
    }>;
}
