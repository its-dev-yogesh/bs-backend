export declare class RegisterDto {
    username: string;
    phone: string;
    email?: string;
    password: string;
}
export declare class LoginDto {
    phone: string;
}
export declare class VerifyOtpDto {
    phone: string;
    otp_code: string;
}
export declare class RefreshTokenDto {
    refresh_token: string;
}
export declare class ResendOtpDto {
    phone: string;
}
