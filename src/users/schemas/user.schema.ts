import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';

export type UserDocument = HydratedDocument<User>;

export enum UserType {
  AGENT = 'agent',
  USER = 'user',
}

export enum UserStatus {
  ACTIVE = 'active',
  BANNED = 'banned',
  DELETED = 'deleted',
}

@Schema({ timestamps: true })
export class User {
  @ApiProperty({
    description: 'Unique identifier (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id?: string;

  @Prop({ default: () => uuidv4(), unique: true })
  @ApiProperty({
    description: 'MongoDB ID',
  })
  _id?: string;

  @Prop({ required: true, unique: true })
  @ApiProperty({
    description: 'Unique username',
    example: 'johndoe',
  })
  username: string;

  @Prop({ required: true, unique: true })
  @ApiProperty({
    description: 'Email address',
    example: 'john@example.com',
  })
  email: string;

  @Prop()
  @ApiProperty({
    description: 'Phone number',
    example: '+1234567890',
    required: false,
  })
  phone?: string;

  @Prop({ required: true })
  @ApiProperty({
    description: 'Hashed password (bcrypt)',
    example: '$2b$10$...',
  })
  password_hash: string;

  @Prop({ default: false })
  @ApiProperty({
    description: 'Email verification status',
    example: false,
  })
  is_verified: boolean;

  @Prop({ enum: UserType, default: UserType.USER })
  @ApiProperty({
    description: 'User type: agent or regular user',
    enum: UserType,
    example: UserType.USER,
  })
  type: UserType;

  @Prop({ enum: UserStatus, default: UserStatus.ACTIVE })
  @ApiProperty({
    description: 'Account status',
    enum: UserStatus,
    example: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @ApiProperty({
    description: 'Account creation timestamp',
    example: '2024-04-26T19:00:00.000Z',
  })
  createdAt?: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-04-26T19:00:00.000Z',
  })
  updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Create indexes for better query performance
UserSchema.index({ username: 1 });
UserSchema.index({ email: 1 });
UserSchema.index({ type: 1 });
UserSchema.index({ status: 1 });

