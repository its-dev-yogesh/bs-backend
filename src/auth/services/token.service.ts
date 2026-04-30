import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

export interface JwtPayload {
  sub: string; // user id
  username: string;
  email: string;
  type: string; // 'user' or 'agent'
  role: string; // 'user' | 'admin' | 'super_admin'
  iat?: number;
  exp?: number;
}

@Injectable()
export class AuthTokenService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  /**
   * Generate access token (short-lived)
   */
  generateAccessToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload, {
      expiresIn: '15m', // 15 minutes
      secret: this.configService.get<string>('JWT_SECRET'),
    });
  }

  /**
   * Generate refresh token (long-lived)
   */
  generateRefreshToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload, {
      expiresIn: '7d', // 7 days
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
    });
  }

  /**
   * Generate both access and refresh tokens
   */
  generateTokens(payload: JwtPayload): {
    access_token: string;
    refresh_token: string;
  } {
    return {
      access_token: this.generateAccessToken(payload),
      refresh_token: this.generateRefreshToken(payload),
    };
  }

  /**
   * Verify access token
   */
  verifyAccessToken(token: string): JwtPayload | null {
    try {
      return this.jwtService.verify<JwtPayload>(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
    } catch {
      return null;
    }
  }

  /**
   * Verify refresh token
   */
  verifyRefreshToken(token: string): JwtPayload | null {
    try {
      return this.jwtService.verify<JwtPayload>(token, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      return null;
    }
  }

  /**
   * Decode token without verification
   */
  decodeToken(token: string): JwtPayload | null {
    try {
      return this.jwtService.decode(token);
    } catch {
      return null;
    }
  }

  /**
   * Refresh access token using refresh token
   */
  refreshAccessToken(refreshToken: string): { access_token: string } | null {
    const payload = this.verifyRefreshToken(refreshToken);
    if (!payload) {
      return null;
    }

    const newPayload: JwtPayload = {
      sub: payload.sub,
      username: payload.username,
      email: payload.email,
      type: payload.type,
      role: payload.role,
    };

    return {
      access_token: this.generateAccessToken(newPayload),
    };
  }
}
