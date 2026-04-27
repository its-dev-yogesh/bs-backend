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
exports.PropertyRequirementSchema = exports.PropertyRequirement = exports.RequirementListingType = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const swagger_1 = require("@nestjs/swagger");
const uuid_1 = require("uuid");
const property_listing_schema_1 = require("./property-listing.schema");
var RequirementListingType;
(function (RequirementListingType) {
    RequirementListingType["BUY"] = "buy";
    RequirementListingType["RENT"] = "rent";
})(RequirementListingType || (exports.RequirementListingType = RequirementListingType = {}));
let PropertyRequirement = class PropertyRequirement {
    _id;
    post_id;
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
    createdAt;
};
exports.PropertyRequirement = PropertyRequirement;
__decorate([
    (0, mongoose_1.Prop)({ default: () => (0, uuid_1.v4)() }),
    (0, swagger_1.ApiProperty)({ description: 'MongoDB ID (UUID)' }),
    __metadata("design:type", String)
], PropertyRequirement.prototype, "_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: String, unique: true, index: true }),
    (0, swagger_1.ApiProperty)({ description: 'Reference to Post ID' }),
    __metadata("design:type", String)
], PropertyRequirement.prototype, "post_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number }),
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Number)
], PropertyRequirement.prototype, "budget_min", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number }),
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Number)
], PropertyRequirement.prototype, "budget_max", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: property_listing_schema_1.PropertyType }),
    (0, swagger_1.ApiProperty)({ enum: property_listing_schema_1.PropertyType, required: false }),
    __metadata("design:type", String)
], PropertyRequirement.prototype, "property_type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: RequirementListingType }),
    (0, swagger_1.ApiProperty)({ enum: RequirementListingType }),
    __metadata("design:type", String)
], PropertyRequirement.prototype, "listing_type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number }),
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Number)
], PropertyRequirement.prototype, "bhk_min", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number }),
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Number)
], PropertyRequirement.prototype, "bhk_max", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], PropertyRequirement.prototype, "preferred_location_text", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number }),
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Number)
], PropertyRequirement.prototype, "latitude", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number }),
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Number)
], PropertyRequirement.prototype, "longitude", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Date)
], PropertyRequirement.prototype, "move_in_by", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Date)
], PropertyRequirement.prototype, "createdAt", void 0);
exports.PropertyRequirement = PropertyRequirement = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: { createdAt: true, updatedAt: false },
        collection: 'property_requirements',
    })
], PropertyRequirement);
exports.PropertyRequirementSchema = mongoose_1.SchemaFactory.createForClass(PropertyRequirement);
//# sourceMappingURL=property-requirement.schema.js.map