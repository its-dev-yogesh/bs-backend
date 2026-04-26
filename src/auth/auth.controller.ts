import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService, AuthResponse } from './auth.service';
import { RegisterDto, LoginDto, VerifyOtpDto, RefreshTokenDto, ResendOtpDto } from './dto/auth.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from '../users/schemas/user.schema';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user with email' })
  @ApiResponse({
    status: 201,
    description: 'User registered. Check email for OTP.',
    schema: {
      example: {
        email: 'user@example.com',
        message: 'Registration successful. Check your email for OTP.',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Email already registered' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('verify-registration')
  @ApiOperation({ summary: 'Verify registration OTP and complete signup' })
  @ApiResponse({
    status: 200,
    description: 'Registration verified. Tokens generated.',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid OTP' })
  async verifyRegistration(@Body() verifyOtpDto: VerifyOtpDto): Promise<AuthResponse> {
    return this.authService.verifyRegistrationOtp(verifyOtpDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Initiate login with email (OTP-based)' })
  @ApiResponse({
    status: 201,
    description: 'OTP sent to email',
    schema: {
      example: {
        email: 'user@example.com',
        message: 'OTP sent to your email. Please verify to complete login.',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'User not found' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'Verify login OTP and get tokens' })
  @ApiResponse({
    status: 200,
    description: 'OTP verified. Tokens generated.',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid OTP' })
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto): Promise<AuthResponse> {
    return this.authService.verifyOtp(verifyOtpDto);
  }

  @Post('resend-otp')
  @ApiOperation({ summary: 'Resend OTP to email' })
  @ApiResponse({
    status: 200,
    description: 'OTP resent',
    schema: {
      example: {
        email: 'user@example.com',
        message: 'OTP resent to your email.',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'User not found' })
  async resendOtp(@Body() resendOtpDto: ResendOtpDto) {
    return this.authService.resendOtp(resendOtpDto);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({
    status: 200,
    description: 'New access token generated',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        expires_in: 900,
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshAccessToken(refreshTokenDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({ summary: 'Get current authenticated user' })
  @ApiResponse({
    status: 200,
    description: 'Current user details',
    type: User,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getCurrentUser(@CurrentUser() user: User): Promise<User> {
    return user;
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({
    status: 200,
    description: 'Logged out successfully',
    schema: {
      example: {
        message: 'Logged out successfully',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async logout(@CurrentUser() user: User) {
    // Token will be invalidated on client side (removal from local storage)
    return { message: 'Logged out successfully' };
  }
}
