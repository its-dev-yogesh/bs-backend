import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';
import {
  FurnishingType,
  ListingType,
  PropertyType,
  ProjectStatus,
  ProjectType,
} from '../schemas/property-listing.schema';

export class CreatePropertyListingDto {
  @ApiProperty({ example: 8500000 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ enum: PropertyType })
  @IsEnum(PropertyType)
  property_type: PropertyType;

  @ApiProperty({ enum: ListingType })
  @IsEnum(ListingType)
  listing_type: ListingType;

  @ApiProperty({ enum: ProjectType, required: false })
  @IsOptional()
  @IsEnum(ProjectType)
  project_type?: ProjectType;

  @ApiProperty({ enum: ProjectStatus, required: false })
  @IsOptional()
  @IsEnum(ProjectStatus)
  project_status?: ProjectStatus;

  @ApiProperty({ example: '2bhk', required: false })
  @IsOptional()
  config?: string;

  @ApiProperty({ example: '123 Main St, City', required: false })
  @IsOptional()
  address?: string;

  @ApiProperty({ example: 3, required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  bhk?: number;

  @ApiProperty({ example: 2, required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  bathrooms?: number;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  balconies?: number;

  @ApiProperty({ example: 1200, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  area_sqft?: number;

  @ApiProperty({ example: 5, required: false })
  @IsOptional()
  @IsInt()
  floor_number?: number;

  @ApiProperty({ example: 12, required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  total_floors?: number;

  @ApiProperty({ enum: FurnishingType, required: false })
  @IsOptional()
  @IsEnum(FurnishingType)
  furnishing?: FurnishingType;

  @ApiProperty({ example: '2026-06-01', required: false })
  @IsOptional()
  @IsDateString()
  available_from?: string;

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  amenities?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  floor_plan_url?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  contact_phone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  whatsapp_number?: string;
}

export class UpsertPropertyListingDto extends CreatePropertyListingDto {
  @ApiProperty({ description: 'Post ID' })
  @IsNotEmpty()
  post_id: string;
}
