import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type OtpDocument = HydratedDocument<Otp>;

export enum OtpType {
  LOGIN = 'login',
  REGISTRATION = 'registration',
  PASSWORD_RESET = 'password_reset',
  EMAIL_VERIFICATION = 'email_verification',
}

export enum OtpStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  EXPIRED = 'expired',
  USED = 'used',
}

@Schema({ timestamps: true })
export class Otp {
  @ApiProperty({
    description: 'MongoDB ID',
  })
  _id?: string;

  @Prop({ required: true })
  @ApiProperty({
    description: 'Email address for OTP',
    example: 'user@example.com',
  })
  email: string;

  @Prop({ required: true })
  @ApiProperty({
    description: 'OTP code (6 digits)',
    example: '123456',
  })
  otp_code: string;

  @Prop({ required: true, enum: OtpType })
  @ApiProperty({
    description: 'Type of OTP',
    enum: OtpType,
    example: OtpType.LOGIN,
  })
  type: OtpType;

  @Prop({ required: true, enum: OtpStatus, default: OtpStatus.PENDING })
  @ApiProperty({
    description: 'OTP status',
    enum: OtpStatus,
    example: OtpStatus.PENDING,
  })
  status: OtpStatus;

  @Prop({ required: true, default: () => new Date(Date.now() + 10 * 60 * 1000) })
  @ApiProperty({
    description: 'OTP expiration time (10 minutes)',
    example: '2024-04-26T19:10:00.000Z',
  })
  expires_at: Date;

  @Prop({ default: 0 })
  @ApiProperty({
    description: 'Number of attempts made',
    example: 0,
  })
  attempts: number;

  @Prop({ default: 3 })
  @ApiProperty({
    description: 'Maximum allowed attempts',
    example: 3,
  })
  max_attempts: number;

  @Prop()
  @ApiProperty({
    description: 'Additional metadata',
    required: false,
  })
  metadata?: Record<string, any>;

  @ApiProperty({
    description: 'OTP creation timestamp',
    example: '2024-04-26T19:00:00.000Z',
  })
  createdAt?: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-04-26T19:00:00.000Z',
  })
  updatedAt?: Date;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);

// Create indexes for better query performance
OtpSchema.index({ email: 1 });
OtpSchema.index({ otp_code: 1 });
OtpSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 }); // TTL index
OtpSchema.index({ type: 1 });
