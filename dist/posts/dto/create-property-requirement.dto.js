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
exports.CreatePropertyRequirementDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const property_listing_schema_1 = require("../schemas/property-listing.schema");
const property_requirement_schema_1 = require("../schemas/property-requirement.schema");
class CreatePropertyRequirementDto {
    budget_min;
    budget_max;
    property_type;
    listing_type;
    bhk_min;
    bhk_max;
    preferred_location_text;
    latitude;
    longitude;
    move_in_by;
}
exports.CreatePropertyRequirementDto = CreatePropertyRequirementDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5000000, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreatePropertyRequirementDto.prototype, "budget_min", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 9000000, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreatePropertyRequirementDto.prototype, "budget_max", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: property_listing_schema_1.PropertyType, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(property_listing_schema_1.PropertyType),
    __metadata("design:type", String)
], CreatePropertyRequirementDto.prototype, "property_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: property_requirement_schema_1.RequirementListingType }),
    (0, class_validator_1.IsEnum)(property_requirement_schema_1.RequirementListingType),
    __metadata("design:type", String)
], CreatePropertyRequirementDto.prototype, "listing_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreatePropertyRequirementDto.prototype, "bhk_min", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 4, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreatePropertyRequirementDto.prototype, "bhk_max", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Whitefield, Bangalore', required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePropertyRequirementDto.prototype, "preferred_location_text", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 12.9698, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatePropertyRequirementDto.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 77.7499, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatePropertyRequirementDto.prototype, "longitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-08-15', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreatePropertyRequirementDto.prototype, "move_in_by", void 0);
//# sourceMappingURL=create-property-requirement.dto.js.map