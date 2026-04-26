import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength, IsOptional } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'johndoe',
    description: 'Username (min 3 characters)',
  })
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'Email address',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'SecurePassword123!',
    description: 'Password (min 8 characters)',
    minLength: 8,
  })
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'Phone number (optional)',
    required: false,
  })
  @IsOptional()
  phone?: string;
}

export class LoginDto {
  @ApiProperty({
    example: 'john@example.com',
    description: 'Email address',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class VerifyOtpDto {
  @ApiProperty({
    example: 'john@example.com',
    description: 'Email address',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'OTP code (6 digits)',
  })
  @IsNotEmpty()
  @MinLength(6)
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
    example: 'john@example.com',
    description: 'Email address',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
