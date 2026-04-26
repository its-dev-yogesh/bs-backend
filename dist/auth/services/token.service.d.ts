import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
export interface JwtPayload {
    sub: string;
    username: string;
    email: string;
    type: string;
    iat?: number;
    exp?: number;
}
export declare class AuthTokenService {
    private jwtService;
    private configService;
    constructor(jwtService: JwtService, configService: ConfigService);
    generateAccessToken(payload: JwtPayload): string;
    generateRefreshToken(payload: JwtPayload): string;
    generateTokens(payload: JwtPayload): {
        access_token: string;
        refresh_token: string;
    };
    verifyAccessToken(token: string): JwtPayload | null;
    verifyRefreshToken(token: string): JwtPayload | null;
    decodeToken(token: string): JwtPayload | null;
    refreshAccessToken(refreshToken: string): {
        access_token: string;
    } | null;
}
