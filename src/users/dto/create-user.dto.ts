import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsEnum, MinLength } from 'class-validator';
import { UserType } from '../schemas/user.schema';

export class CreateUserDto {
  @ApiProperty({
    example: 'johndoe',
    description: 'Unique username',
  })
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'Email address (must be unique)',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'SecurePassword123!',
    description: 'Password (will be hashed)',
    minLength: 8,
  })
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'Phone number',
    required: false,
  })
  @IsOptional()
  phone?: string;

  @ApiProperty({
    example: 'user',
    description: 'User type: agent or user',
    enum: UserType,
    required: false,
  })
  @IsOptional()
  @IsEnum(UserType)
  type?: UserType;
}
