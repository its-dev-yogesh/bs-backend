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
exports.UpsertPropertyListingDto = exports.CreatePropertyListingDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const property_listing_schema_1 = require("../schemas/property-listing.schema");
class CreatePropertyListingDto {
    price;
    property_type;
    listing_type;
    bhk;
    bathrooms;
    balconies;
    area_sqft;
    floor_number;
    total_floors;
    furnishing;
    available_from;
}
exports.CreatePropertyListingDto = CreatePropertyListingDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 8500000 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreatePropertyListingDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: property_listing_schema_1.PropertyType }),
    (0, class_validator_1.IsEnum)(property_listing_schema_1.PropertyType),
    __metadata("design:type", String)
], CreatePropertyListingDto.prototype, "property_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: property_listing_schema_1.ListingType }),
    (0, class_validator_1.IsEnum)(property_listing_schema_1.ListingType),
    __metadata("design:type", String)
], CreatePropertyListingDto.prototype, "listing_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreatePropertyListingDto.prototype, "bhk", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreatePropertyListingDto.prototype, "bathrooms", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreatePropertyListingDto.prototype, "balconies", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1200, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreatePropertyListingDto.prototype, "area_sqft", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreatePropertyListingDto.prototype, "floor_number", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 12, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreatePropertyListingDto.prototype, "total_floors", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: property_listing_schema_1.FurnishingType, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(property_listing_schema_1.FurnishingType),
    __metadata("design:type", String)
], CreatePropertyListingDto.prototype, "furnishing", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-06-01', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreatePropertyListingDto.prototype, "available_from", void 0);
class UpsertPropertyListingDto extends CreatePropertyListingDto {
    post_id;
}
exports.UpsertPropertyListingDto = UpsertPropertyListingDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Post ID' }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpsertPropertyListingDto.prototype, "post_id", void 0);
//# sourceMappingURL=create-property-listing.dto.js.map