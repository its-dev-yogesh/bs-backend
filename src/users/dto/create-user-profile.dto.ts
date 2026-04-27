import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsDateString } from 'class-validator';
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
