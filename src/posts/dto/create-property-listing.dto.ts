import { ApiProperty } from '@nestjs/swagger';
import {
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
}

export class UpsertPropertyListingDto extends CreatePropertyListingDto {
  @ApiProperty({ description: 'Post ID' })
  @IsNotEmpty()
  post_id: string;
}
