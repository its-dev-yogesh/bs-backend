import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  Matches,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'johndoe',
    description: 'Username (min 3 characters)',
  })
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @ApiProperty({
    example: '+919876543210',
    description: 'Phone number in E.164 format (used for OTP)',
  })
  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'Email address (optional)',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    example: 'SecurePassword123!',
    description: 'Password (min 8 characters)',
    minLength: 8,
  })
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}

export class LoginDto {
  @ApiProperty({
    example: '+919876543210',
    description: 'Phone number in E.164 format',
  })
  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;
}

export class VerifyOtpDto {
  @ApiProperty({
    example: '+919876543210',
    description: 'Phone number in E.164 format',
  })
  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({
    example: '123456',
    description: 'OTP code (6 digits)',
  })
  @IsNotEmpty()
  @Matches(/^\d{6}$/, { message: 'otp_code must be a 6-digit number' })
  otp_code: string;
}

export class RefreshTokenDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Refresh token',
  })
  @IsNotEmpty()
  refresh_token: string;
}

export class ResendOtpDto {
  @ApiProperty({
    example: '+919876543210',
    description: 'Phone number in E.164 format',
  })
  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;
}
