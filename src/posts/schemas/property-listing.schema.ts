import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';

export type PropertyListingDocument = HydratedDocument<PropertyListing>;

export enum PropertyType {
  FLAT = 'flat',
  HOUSE = 'house',
  VILLA = 'villa',
  PLOT = 'plot',
}

export enum ListingType {
  SALE = 'sale',
  RENT = 'rent',
}

export enum FurnishingType {
  FURNISHED = 'furnished',
  SEMI = 'semi',
  UNFURNISHED = 'unfurnished',
}

export enum ProjectType {
  RESIDENTIAL = 'Residential',
  COMMERCIAL = 'Commercial',
  INDUSTRIAL = 'Industrial',
  MIXED_USE = 'Mixed Use',
}

export enum ProjectStatus {
  READY_TO_MOVE = 'Ready to move',
  UNDER_CONSTRUCTION = 'Under Construction',
}

@Schema({
  timestamps: { createdAt: true, updatedAt: false },
  collection: 'property_listings',
})
export class PropertyListing {
  @Prop({ default: () => uuidv4() })
  @ApiProperty({ description: 'MongoDB ID (UUID)' })
  _id?: string;

  @Prop({ required: true, type: String, unique: true, index: true })
  @ApiProperty({ description: 'Reference to Post ID' })
  post_id: string;

  @Prop({ required: true, type: Number })
  @ApiProperty({ description: 'Asking price' })
  price: number;

  @Prop({ required: true, enum: PropertyType })
  @ApiProperty({ enum: PropertyType })
  property_type: PropertyType;

  @Prop({ required: true, enum: ListingType })
  @ApiProperty({ enum: ListingType })
  listing_type: ListingType;

  @Prop({ type: Number })
  @ApiProperty({ description: 'Number of bedrooms (BHK)', required: false })
  bhk?: number;

  @Prop({ type: Number })
  @ApiProperty({ required: false })
  bathrooms?: number;

  @Prop({ type: Number })
  @ApiProperty({ required: false })
  balconies?: number;

  @Prop({ type: Number })
  @ApiProperty({ description: 'Carpet/built-up area in sqft', required: false })
  area_sqft?: number;

  @Prop({ type: Number })
  @ApiProperty({ required: false })
  floor_number?: number;

  @Prop({ type: Number })
  @ApiProperty({ required: false })
  total_floors?: number;

  @Prop({ enum: FurnishingType })
  @ApiProperty({ enum: FurnishingType, required: false })
  furnishing?: FurnishingType;

  @Prop({ type: Date })
  @ApiProperty({ required: false })
  available_from?: Date;

  @Prop({ type: [String], default: [] })
  @ApiProperty({ type: [String], required: false })
  amenities?: string[];

  @Prop()
  @ApiProperty({ required: false })
  floor_plan_url?: string;

  @Prop()
  @ApiProperty({ required: false })
  contact_phone?: string;

  @Prop()
  @ApiProperty({ required: false })
  whatsapp_number?: string;

  @Prop({ enum: ProjectType })
  @ApiProperty({ enum: ProjectType, required: false })
  project_type?: ProjectType;

  @Prop({ enum: ProjectStatus })
  @ApiProperty({ enum: ProjectStatus, required: false })
  project_status?: ProjectStatus;

  @Prop()
  @ApiProperty({ description: 'e.g. 2bhk, 3bhk, villa', required: false })
  config?: string;

  @Prop()
  @ApiProperty({ description: 'Property address', required: false })
  address?: string;

  @ApiProperty({ required: false })
  createdAt?: Date;
}

export const PropertyListingSchema =
  SchemaFactory.createForClass(PropertyListing);
