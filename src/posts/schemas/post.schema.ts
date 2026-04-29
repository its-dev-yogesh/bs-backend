import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';

export type PostDocument = HydratedDocument<Post>;

export enum PostType {
  LISTING = 'listing',
  REQUIREMENT = 'requirement',
}

export enum PostVisibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

export enum PostStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Schema({ timestamps: true, collection: 'posts' })
export class Post {
  @Prop({ default: () => uuidv4() })
  @ApiProperty({ description: 'MongoDB ID (UUID)' })
  _id?: string;

  @Prop({ required: true, type: String, index: true })
  @ApiProperty({ description: 'Author user ID' })
  user_id: string;

  @Prop({ required: true, enum: PostType, index: true })
  @ApiProperty({ description: 'Post type', enum: PostType })
  type: PostType;

  @Prop({ required: true })
  @ApiProperty({ description: 'Title' })
  title: string;

  @Prop()
  @ApiProperty({ description: 'Description', required: false })
  description?: string;

  @Prop()
  @ApiProperty({ description: 'Free-form location text', required: false })
  location_text?: string;

  @Prop()
  @ApiProperty({
    description: 'WhatsApp number for direct enquiries (with country code)',
    required: false,
    example: '919876543210',
  })
  whatsapp_number?: string;

  @Prop({ type: Number })
  @ApiProperty({ description: 'Latitude', required: false })
  latitude?: number;

  @Prop({ type: Number })
  @ApiProperty({ description: 'Longitude', required: false })
  longitude?: number;

  @Prop({ enum: PostVisibility, default: PostVisibility.PUBLIC })
  @ApiProperty({ enum: PostVisibility, default: PostVisibility.PUBLIC })
  visibility: PostVisibility;

  @Prop({ enum: PostStatus, default: PostStatus.ACTIVE, index: true })
  @ApiProperty({ enum: PostStatus, default: PostStatus.ACTIVE })
  status: PostStatus;

  @ApiProperty({ description: 'Created at', required: false })
  createdAt?: Date;

  @ApiProperty({ description: 'Updated at', required: false })
  updatedAt?: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.index({ user_id: 1, createdAt: -1 });
PostSchema.index({ type: 1, status: 1, createdAt: -1 });
