import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';

export type UserProfileDocument = HydratedDocument<UserProfile>;

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

@Schema({ timestamps: true })
export class UserProfile {
  @ApiProperty({
    description: 'Unique identifier (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id?: string;

  @Prop({ default: () => uuidv4() })
  @ApiProperty({
    description: 'MongoDB ID',
  })
  _id?: string;

  @Prop({ required: true, type: String })
  @ApiProperty({
    description: 'Reference to User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  user_id: string;

  @Prop()
  @ApiProperty({
    description: 'Full name of the user',
    example: 'John Doe',
    required: false,
  })
  full_name?: string;

  @Prop()
  @ApiProperty({
    description: 'Short professional headline',
    example: 'Commercial broker · Mumbai',
    required: false,
  })
  headline?: string;

  @Prop()
  @ApiProperty({
    description: 'Biography or bio description',
    example: 'Real estate agent with 10+ years of experience',
    required: false,
  })
  bio?: string;

  @Prop()
  @ApiProperty({
    description: 'Avatar image URL',
    example: 'https://example.com/avatars/user123.jpg',
    required: false,
  })
  avatar_url?: string;

  @Prop({ type: Number })
  @ApiProperty({
    description: 'Vertical crop focus for avatar image (0 top, 100 bottom)',
    example: 40,
    required: false,
  })
  avatar_position_y?: number;

  @Prop({ type: Number })
  @ApiProperty({
    description: 'Avatar zoom level for crop framing (1x-3x)',
    example: 1.25,
    required: false,
  })
  avatar_zoom?: number;

  @Prop()
  @ApiProperty({
    description: 'Banner / cover image URL',
    required: false,
  })
  banner_url?: string;

  @Prop({ type: Number })
  @ApiProperty({
    description: 'Vertical crop focus for banner image (0 top, 100 bottom)',
    example: 35,
    required: false,
  })
  banner_position_y?: number;

  @Prop({ type: Number })
  @ApiProperty({
    description: 'Banner zoom level for crop framing (1x-3x)',
    example: 1.2,
    required: false,
  })
  banner_zoom?: number;

  @Prop()
  @ApiProperty({
    description: 'Banner theme preset key',
    example: 'ocean',
    required: false,
  })
  banner_theme?: string;

  @Prop()
  @ApiProperty({
    description: 'Personal or business website',
    example: 'https://www.johndoe.com',
    required: false,
  })
  website?: string;

  @Prop({ type: Date })
  @ApiProperty({
    description: 'Date of birth',
    example: '1990-01-15',
    required: false,
  })
  dob?: Date;

  @Prop({ enum: Gender })
  @ApiProperty({
    description: 'Gender: male, female, or other',
    enum: Gender,
    required: false,
  })
  gender?: Gender;

  @Prop()
  @ApiProperty({
    description: 'Real Estate Registration Number (for agents)',
    example: 'RE123456789',
    required: false,
  })
  rerano?: string;

  @Prop()
  @ApiProperty({
    description: 'Location/Address',
    example: 'New York, NY, USA',
    required: false,
  })
  location?: string;

  @ApiProperty({
    description: 'Profile creation timestamp',
    example: '2024-04-26T19:00:00.000Z',
  })
  createdAt?: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-04-26T19:00:00.000Z',
  })
  updatedAt?: Date;
}

export const UserProfileSchema = SchemaFactory.createForClass(UserProfile);

// Create indexes for better query performance
UserProfileSchema.index({ user_id: 1 });
