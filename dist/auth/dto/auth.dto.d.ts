export declare class RegisterDto {
    username: string;
    email: string;
    password: string;
    phone?: string;
}
export declare class LoginDto {
    email: string;
}
export declare class VerifyOtpDto {
    email: string;
    otp_code: string;
}
export declare class RefreshTokenDto {
    refresh_token: string;
}
export declare class ResendOtpDto {
    email: string;
}
