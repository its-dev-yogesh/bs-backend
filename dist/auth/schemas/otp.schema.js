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
exports.OtpSchema = exports.Otp = exports.OtpStatus = exports.OtpType = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const swagger_1 = require("@nestjs/swagger");
var OtpType;
(function (OtpType) {
    OtpType["LOGIN"] = "login";
    OtpType["REGISTRATION"] = "registration";
    OtpType["PASSWORD_RESET"] = "password_reset";
    OtpType["EMAIL_VERIFICATION"] = "email_verification";
})(OtpType || (exports.OtpType = OtpType = {}));
var OtpStatus;
(function (OtpStatus) {
    OtpStatus["PENDING"] = "pending";
    OtpStatus["VERIFIED"] = "verified";
    OtpStatus["EXPIRED"] = "expired";
    OtpStatus["USED"] = "used";
})(OtpStatus || (exports.OtpStatus = OtpStatus = {}));
let Otp = class Otp {
    _id;
    phone;
    otp_code;
    type;
    status;
    expires_at;
    attempts;
    max_attempts;
    metadata;
    createdAt;
    updatedAt;
};
exports.Otp = Otp;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'MongoDB ID',
    }),
    __metadata("design:type", String)
], Otp.prototype, "_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    (0, swagger_1.ApiProperty)({
        description: 'Phone number for OTP (E.164 format)',
        example: '+919876543210',
    }),
    __metadata("design:type", String)
], Otp.prototype, "phone", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    (0, swagger_1.ApiProperty)({
        description: 'OTP code (6 digits)',
        example: '123456',
    }),
    __metadata("design:type", String)
], Otp.prototype, "otp_code", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: OtpType }),
    (0, swagger_1.ApiProperty)({
        description: 'Type of OTP',
        enum: OtpType,
        example: OtpType.LOGIN,
    }),
    __metadata("design:type", String)
], Otp.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: OtpStatus, default: OtpStatus.PENDING }),
    (0, swagger_1.ApiProperty)({
        description: 'OTP status',
        enum: OtpStatus,
        example: OtpStatus.PENDING,
    }),
    __metadata("design:type", String)
], Otp.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        default: () => new Date(Date.now() + 10 * 60 * 1000),
    }),
    (0, swagger_1.ApiProperty)({
        description: 'OTP expiration time (10 minutes)',
        example: '2024-04-26T19:10:00.000Z',
    }),
    __metadata("design:type", Date)
], Otp.prototype, "expires_at", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    (0, swagger_1.ApiProperty)({
        description: 'Number of attempts made',
        example: 0,
    }),
    __metadata("design:type", Number)
], Otp.prototype, "attempts", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 3 }),
    (0, swagger_1.ApiProperty)({
        description: 'Maximum allowed attempts',
        example: 3,
    }),
    __metadata("design:type", Number)
], Otp.prototype, "max_attempts", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    (0, swagger_1.ApiProperty)({
        description: 'Additional metadata',
        required: false,
    }),
    __metadata("design:type", Object)
], Otp.prototype, "metadata", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'OTP creation timestamp',
        example: '2024-04-26T19:00:00.000Z',
    }),
    __metadata("design:type", Date)
], Otp.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Last update timestamp',
        example: '2024-04-26T19:00:00.000Z',
    }),
    __metadata("design:type", Date)
], Otp.prototype, "updatedAt", void 0);
exports.Otp = Otp = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Otp);
exports.OtpSchema = mongoose_1.SchemaFactory.createForClass(Otp);
exports.OtpSchema.index({ phone: 1 });
exports.OtpSchema.index({ otp_code: 1 });
exports.OtpSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });
exports.OtpSchema.index({ type: 1 });
//# sourceMappingURL=otp.schema.js.map