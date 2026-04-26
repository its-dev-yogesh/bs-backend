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
exports.AuthResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const user_schema_1 = require("../../users/schemas/user.schema");
class AuthResponseDto {
    user;
    access_token;
    refresh_token;
    expires_in;
    token_type;
}
exports.AuthResponseDto = AuthResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: user_schema_1.User,
        description: 'Authenticated user details',
    }),
    __metadata("design:type", user_schema_1.User)
], AuthResponseDto.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        description: 'JWT access token',
    }),
    __metadata("design:type", String)
], AuthResponseDto.prototype, "access_token", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        description: 'Refresh token',
    }),
    __metadata("design:type", String)
], AuthResponseDto.prototype, "refresh_token", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 900,
        description: 'Token expiration time in seconds',
    }),
    __metadata("design:type", Number)
], AuthResponseDto.prototype, "expires_in", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Bearer',
        description: 'Token type',
    }),
    __metadata("design:type", String)
], AuthResponseDto.prototype, "token_type", void 0);
//# sourceMappingURL=auth-response.dto.js.map