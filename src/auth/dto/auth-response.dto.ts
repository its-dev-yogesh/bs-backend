import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/schemas/user.schema';

export class AuthResponseDto {
  @ApiProperty({
    type: User,
    description: 'Authenticated user details',
  })
  user: User;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access token',
  })
  access_token: string;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Refresh token',
  })
  refresh_token: string;

  @ApiProperty({
    example: 900,
    description: 'Token expiration time in seconds',
  })
  expires_in: number;

  @ApiProperty({
    example: 'Bearer',
    description: 'Token type',
  })
  token_type: string;
}
