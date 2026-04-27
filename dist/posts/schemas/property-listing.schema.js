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
exports.PropertyListingSchema = exports.PropertyListing = exports.FurnishingType = exports.ListingType = exports.PropertyType = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const swagger_1 = require("@nestjs/swagger");
const uuid_1 = require("uuid");
var PropertyType;
(function (PropertyType) {
    PropertyType["FLAT"] = "flat";
    PropertyType["HOUSE"] = "house";
    PropertyType["VILLA"] = "villa";
    PropertyType["PLOT"] = "plot";
})(PropertyType || (exports.PropertyType = PropertyType = {}));
var ListingType;
(function (ListingType) {
    ListingType["SALE"] = "sale";
    ListingType["RENT"] = "rent";
})(ListingType || (exports.ListingType = ListingType = {}));
var FurnishingType;
(function (FurnishingType) {
    FurnishingType["FURNISHED"] = "furnished";
    FurnishingType["SEMI"] = "semi";
    FurnishingType["UNFURNISHED"] = "unfurnished";
})(FurnishingType || (exports.FurnishingType = FurnishingType = {}));
let PropertyListing = class PropertyListing {
    _id;
    post_id;
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
    createdAt;
};
exports.PropertyListing = PropertyListing;
__decorate([
    (0, mongoose_1.Prop)({ default: () => (0, uuid_1.v4)() }),
    (0, swagger_1.ApiProperty)({ description: 'MongoDB ID (UUID)' }),
    __metadata("design:type", String)
], PropertyListing.prototype, "_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: String, unique: true, index: true }),
    (0, swagger_1.ApiProperty)({ description: 'Reference to Post ID' }),
    __metadata("design:type", String)
], PropertyListing.prototype, "post_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: Number }),
    (0, swagger_1.ApiProperty)({ description: 'Asking price' }),
    __metadata("design:type", Number)
], PropertyListing.prototype, "price", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: PropertyType }),
    (0, swagger_1.ApiProperty)({ enum: PropertyType }),
    __metadata("design:type", String)
], PropertyListing.prototype, "property_type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ListingType }),
    (0, swagger_1.ApiProperty)({ enum: ListingType }),
    __metadata("design:type", String)
], PropertyListing.prototype, "listing_type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number }),
    (0, swagger_1.ApiProperty)({ description: 'Number of bedrooms (BHK)', required: false }),
    __metadata("design:type", Number)
], PropertyListing.prototype, "bhk", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number }),
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Number)
], PropertyListing.prototype, "bathrooms", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number }),
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Number)
], PropertyListing.prototype, "balconies", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number }),
    (0, swagger_1.ApiProperty)({ description: 'Carpet/built-up area in sqft', required: false }),
    __metadata("design:type", Number)
], PropertyListing.prototype, "area_sqft", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number }),
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Number)
], PropertyListing.prototype, "floor_number", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number }),
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Number)
], PropertyListing.prototype, "total_floors", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: FurnishingType }),
    (0, swagger_1.ApiProperty)({ enum: FurnishingType, required: false }),
    __metadata("design:type", String)
], PropertyListing.prototype, "furnishing", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Date)
], PropertyListing.prototype, "available_from", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Date)
], PropertyListing.prototype, "createdAt", void 0);
exports.PropertyListing = PropertyListing = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: { createdAt: true, updatedAt: false },
        collection: 'property_listings',
    })
], PropertyListing);
exports.PropertyListingSchema = mongoose_1.SchemaFactory.createForClass(PropertyListing);
//# sourceMappingURL=property-listing.schema.js.map