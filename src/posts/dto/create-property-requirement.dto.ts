import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';
import { PropertyType } from '../schemas/property-listing.schema';
import { RequirementListingType } from '../schemas/property-requirement.schema';

export class CreatePropertyRequirementDto {
  @ApiProperty({ example: 5000000, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  budget_min?: number;

  @ApiProperty({ example: 9000000, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  budget_max?: number;

  @ApiProperty({ enum: PropertyType, required: false })
  @IsOptional()
  @IsEnum(PropertyType)
  property_type?: PropertyType;

  @ApiProperty({ enum: RequirementListingType })
  @IsEnum(RequirementListingType)
  listing_type: RequirementListingType;

  @ApiProperty({ example: 2, required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  bhk_min?: number;

  @ApiProperty({ example: 4, required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  bhk_max?: number;

  @ApiProperty({ example: 'Whitefield, Bangalore', required: false })
  @IsOptional()
  preferred_location_text?: string;

  @ApiProperty({ example: 12.9698, required: false })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiProperty({ example: 77.7499, required: false })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiProperty({ example: '2026-08-15', required: false })
  @IsOptional()
  @IsDateString()
  move_in_by?: string;

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  preferred_amenities?: string[];

  @ApiProperty({ example: '2bhk', required: false })
  @IsOptional()
  config?: string;

  @ApiProperty({ example: 'Residential', required: false })
  @IsOptional()
  project_type?: string;

  @ApiProperty({ example: 'Ready to move', required: false })
  @IsOptional()
  project_status?: string;
}
