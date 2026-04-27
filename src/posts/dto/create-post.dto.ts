import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { PostStatus, PostVisibility } from '../schemas/post.schema';
import { CreatePropertyListingDto } from './create-property-listing.dto';
import { CreatePropertyRequirementDto } from './create-property-requirement.dto';

export class BasePostFieldsDto {
  @ApiProperty({ example: '3 BHK in HSR Layout' })
  @IsNotEmpty()
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'HSR Layout, Bangalore', required: false })
  @IsOptional()
  location_text?: string;

  @ApiProperty({ example: 12.9116, required: false })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiProperty({ example: 77.6473, required: false })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiProperty({ enum: PostVisibility, required: false })
  @IsOptional()
  @IsEnum(PostVisibility)
  visibility?: PostVisibility;

  @ApiProperty({ enum: PostStatus, required: false })
  @IsOptional()
  @IsEnum(PostStatus)
  status?: PostStatus;
}

export class CreateListingPostDto extends BasePostFieldsDto {
  @ApiProperty({ type: CreatePropertyListingDto })
  @ValidateNested()
  @Type(() => CreatePropertyListingDto)
  listing: CreatePropertyListingDto;
}

export class CreateRequirementPostDto extends BasePostFieldsDto {
  @ApiProperty({ type: CreatePropertyRequirementDto })
  @ValidateNested()
  @Type(() => CreatePropertyRequirementDto)
  requirement: CreatePropertyRequirementDto;
}

export class UpdatePostDto {
  @ApiProperty({ required: false })
  @IsOptional()
  title?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  location_text?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiProperty({ enum: PostVisibility, required: false })
  @IsOptional()
  @IsEnum(PostVisibility)
  visibility?: PostVisibility;

  @ApiProperty({ enum: PostStatus, required: false })
  @IsOptional()
  @IsEnum(PostStatus)
  status?: PostStatus;
}
