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

  @ApiProperty({ required: false })
  createdAt?: Date;
}

export const PropertyListingSchema =
  SchemaFactory.createForClass(PropertyListing);
