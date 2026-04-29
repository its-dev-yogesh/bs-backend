import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';
import { PropertyType } from './property-listing.schema';

export type PropertyRequirementDocument = HydratedDocument<PropertyRequirement>;

export enum RequirementListingType {
  BUY = 'buy',
  RENT = 'rent',
}

@Schema({
  timestamps: { createdAt: true, updatedAt: false },
  collection: 'property_requirements',
})
export class PropertyRequirement {
  @Prop({ default: () => uuidv4() })
  @ApiProperty({ description: 'MongoDB ID (UUID)' })
  _id?: string;

  @Prop({ required: true, type: String, unique: true, index: true })
  @ApiProperty({ description: 'Reference to Post ID' })
  post_id: string;

  @Prop({ type: Number })
  @ApiProperty({ required: false })
  budget_min?: number;

  @Prop({ type: Number })
  @ApiProperty({ required: false })
  budget_max?: number;

  @Prop({ enum: PropertyType })
  @ApiProperty({ enum: PropertyType, required: false })
  property_type?: PropertyType;

  @Prop({ required: true, enum: RequirementListingType })
  @ApiProperty({ enum: RequirementListingType })
  listing_type: RequirementListingType;

  @Prop({ type: Number })
  @ApiProperty({ required: false })
  bhk_min?: number;

  @Prop({ type: Number })
  @ApiProperty({ required: false })
  bhk_max?: number;

  @Prop()
  @ApiProperty({ required: false })
  preferred_location_text?: string;

  @Prop({ type: Number })
  @ApiProperty({ required: false })
  latitude?: number;

  @Prop({ type: Number })
  @ApiProperty({ required: false })
  longitude?: number;

  @Prop({ type: Date })
  @ApiProperty({ required: false })
  move_in_by?: Date;

  @Prop({ type: [String], default: [] })
  @ApiProperty({ type: [String], required: false })
  preferred_amenities?: string[];

  @Prop()
  @ApiProperty({ description: 'e.g. 2bhk, 3bhk, villa', required: false })
  config?: string;

  @Prop()
  @ApiProperty({ description: 'e.g. Residential, Commercial', required: false })
  project_type?: string;

  @Prop()
  @ApiProperty({ description: 'e.g. Ready to move, Under Construction', required: false })
  project_status?: string;

  @ApiProperty({ required: false })
  createdAt?: Date;
}

export const PropertyRequirementSchema =
  SchemaFactory.createForClass(PropertyRequirement);
