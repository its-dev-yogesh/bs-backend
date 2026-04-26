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
exports.CreateUserProfileDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const user_profile_schema_1 = require("../schemas/user-profile.schema");
class CreateUserProfileDto {
    full_name;
    bio;
    avatar_url;
    website;
    dob;
    gender;
    rerano;
    location;
}
exports.CreateUserProfileDto = CreateUserProfileDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'John Doe',
        description: 'Full name of the user',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateUserProfileDto.prototype, "full_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Real estate agent with 10+ years of experience',
        description: 'User biography',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateUserProfileDto.prototype, "bio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'https://example.com/avatars/user123.jpg',
        description: 'Avatar image URL',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateUserProfileDto.prototype, "avatar_url", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'https://www.johndoe.com',
        description: 'Personal or business website',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateUserProfileDto.prototype, "website", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '1990-01-15',
        description: 'Date of birth',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateUserProfileDto.prototype, "dob", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'male',
        description: 'Gender: male, female, or other',
        enum: user_profile_schema_1.Gender,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(user_profile_schema_1.Gender),
    __metadata("design:type", String)
], CreateUserProfileDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'RE123456789',
        description: 'Real Estate Registration Number (for agents)',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateUserProfileDto.prototype, "rerano", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'New York, NY, USA',
        description: 'Location/Address',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateUserProfileDto.prototype, "location", void 0);
//# sourceMappingURL=create-user-profile.dto.js.map