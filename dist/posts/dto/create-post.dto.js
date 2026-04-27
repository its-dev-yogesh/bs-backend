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
exports.UpdatePostDto = exports.CreateRequirementPostDto = exports.CreateListingPostDto = exports.BasePostFieldsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const post_schema_1 = require("../schemas/post.schema");
const create_property_listing_dto_1 = require("./create-property-listing.dto");
const create_property_requirement_dto_1 = require("./create-property-requirement.dto");
class BasePostFieldsDto {
    title;
    description;
    location_text;
    latitude;
    longitude;
    visibility;
    status;
}
exports.BasePostFieldsDto = BasePostFieldsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '3 BHK in HSR Layout' }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BasePostFieldsDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BasePostFieldsDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'HSR Layout, Bangalore', required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BasePostFieldsDto.prototype, "location_text", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 12.9116, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], BasePostFieldsDto.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 77.6473, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], BasePostFieldsDto.prototype, "longitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: post_schema_1.PostVisibility, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(post_schema_1.PostVisibility),
    __metadata("design:type", String)
], BasePostFieldsDto.prototype, "visibility", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: post_schema_1.PostStatus, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(post_schema_1.PostStatus),
    __metadata("design:type", String)
], BasePostFieldsDto.prototype, "status", void 0);
class CreateListingPostDto extends BasePostFieldsDto {
    listing;
}
exports.CreateListingPostDto = CreateListingPostDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: create_property_listing_dto_1.CreatePropertyListingDto }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => create_property_listing_dto_1.CreatePropertyListingDto),
    __metadata("design:type", create_property_listing_dto_1.CreatePropertyListingDto)
], CreateListingPostDto.prototype, "listing", void 0);
class CreateRequirementPostDto extends BasePostFieldsDto {
    requirement;
}
exports.CreateRequirementPostDto = CreateRequirementPostDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: create_property_requirement_dto_1.CreatePropertyRequirementDto }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => create_property_requirement_dto_1.CreatePropertyRequirementDto),
    __metadata("design:type", create_property_requirement_dto_1.CreatePropertyRequirementDto)
], CreateRequirementPostDto.prototype, "requirement", void 0);
class UpdatePostDto {
    title;
    description;
    location_text;
    latitude;
    longitude;
    visibility;
    status;
}
exports.UpdatePostDto = UpdatePostDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdatePostDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdatePostDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdatePostDto.prototype, "location_text", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdatePostDto.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdatePostDto.prototype, "longitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: post_schema_1.PostVisibility, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(post_schema_1.PostVisibility),
    __metadata("design:type", String)
], UpdatePostDto.prototype, "visibility", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: post_schema_1.PostStatus, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(post_schema_1.PostStatus),
    __metadata("design:type", String)
], UpdatePostDto.prototype, "status", void 0);
//# sourceMappingURL=create-post.dto.js.map