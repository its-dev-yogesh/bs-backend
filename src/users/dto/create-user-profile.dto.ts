import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsEnum, IsDateString, IsNumber, Max, Min } from 'class-validator';
import { Gender } from '../schemas/user-profile.schema';

export class CreateUserProfileDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the user',
    required: false,
  })
  @IsOptional()
  full_name?: string;

  @ApiProperty({
    example: 'Commercial broker · Mumbai',
    description: 'Professional headline',
    required: false,
  })
  @IsOptional()
  headline?: string;

  @ApiProperty({
    example: 'Real estate agent with 10+ years of experience',
    description: 'User biography',
    required: false,
  })
  @IsOptional()
  bio?: string;

  @ApiProperty({
    example: 'https://example.com/avatars/user123.jpg',
    description: 'Avatar image URL',
    required: false,
  })
  @IsOptional()
  avatar_url?: string;

  @ApiProperty({
    example: 40,
    description: 'Vertical crop focus for avatar image (0 top, 100 bottom)',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  avatar_position_y?: number;

  @ApiProperty({
    example: 1.25,
    description: 'Avatar zoom level for crop framing (1x-3x)',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(3)
  avatar_zoom?: number;

  @ApiProperty({
    example: 'https://example.com/banners/cover.jpg',
    description: 'Banner / cover image URL',
    required: false,
  })
  @IsOptional()
  banner_url?: string;

  @ApiProperty({
    example: 35,
    description: 'Vertical crop focus for banner image (0 top, 100 bottom)',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  banner_position_y?: number;

  @ApiProperty({
    example: 1.2,
    description: 'Banner zoom level for crop framing (1x-3x)',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(3)
  banner_zoom?: number;

  @ApiProperty({
    example: 'ocean',
    description: 'Banner theme preset key',
    required: false,
  })
  @IsOptional()
  banner_theme?: string;

  @ApiProperty({
    example: 'https://www.johndoe.com',
    description: 'Personal or business website',
    required: false,
  })
  @IsOptional()
  website?: string;

  @ApiProperty({
    example: '1990-01-15',
    description: 'Date of birth',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  dob?: string;

  @ApiProperty({
    example: 'male',
    description: 'Gender: male, female, or other',
    enum: Gender,
    required: false,
  })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiProperty({
    example: 'RE123456789',
    description: 'Real Estate Registration Number (for agents)',
    required: false,
  })
  @IsOptional()
  rerano?: string;

  @ApiProperty({
    example: 'New York, NY, USA',
    description: 'Location/Address',
    required: false,
  })
  @IsOptional()
  location?: string;
}
