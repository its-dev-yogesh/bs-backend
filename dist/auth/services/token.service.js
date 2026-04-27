"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthTokenService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
let AuthTokenService = class AuthTokenService {
    jwtService;
    configService;
    constructor(jwtService, configService) {
        this.jwtService = jwtService;
        this.configService = configService;
    }
    generateAccessToken(payload) {
        return this.jwtService.sign(payload, {
            expiresIn: '15m',
            secret: this.configService.get('JWT_SECRET'),
        });
    }
    generateRefreshToken(payload) {
        return this.jwtService.sign(payload, {
            expiresIn: '7d',
            secret: this.configService.get('JWT_REFRESH_SECRET'),
        });
    }
    generateTokens(payload) {
        return {
            access_token: this.generateAccessToken(payload),
            refresh_token: this.generateRefreshToken(payload),
        };
    }
    verifyAccessToken(token) {
        try {
            return this.jwtService.verify(token, {
                secret: this.configService.get('JWT_SECRET'),
            });
        }
        catch {
            return null;
        }
    }
    verifyRefreshToken(token) {
        try {
            return this.jwtService.verify(token, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
            });
        }
        catch {
            return null;
        }
    }
    decodeToken(token) {
        try {
            return this.jwtService.decode(token);
        }
        catch {
            return null;
        }
    }
    refreshAccessToken(refreshToken) {
        const payload = this.verifyRefreshToken(refreshToken);
        if (!payload) {
            return null;
        }
        const newPayload = {
            sub: payload.sub,
            username: payload.username,
            email: payload.email,
            type: payload.type,
        };
        return {
            access_token: this.generateAccessToken(newPayload),
        };
    }
};
exports.AuthTokenService = AuthTokenService;
exports.AuthTokenService = AuthTokenService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        config_1.ConfigService])
], AuthTokenService);
//# sourceMappingURL=token.service.js.map