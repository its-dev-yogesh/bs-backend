import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';

export type PostMediaDocument = HydratedDocument<PostMedia>;

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
}

@Schema({ timestamps: true, collection: 'post_media' })
export class PostMedia {
  @Prop({ default: () => uuidv4() })
  @ApiProperty({ description: 'MongoDB ID (UUID)' })
  _id?: string;

  @Prop({ required: true, type: String, index: true })
  @ApiProperty({ description: 'Reference to Post ID' })
  post_id: string;

  @Prop({ required: true })
  @ApiProperty({ description: 'Media URL' })
  url: string;

  @Prop({ required: true, enum: MediaType })
  @ApiProperty({ enum: MediaType })
  type: MediaType;

  @Prop({ type: Number, default: 0 })
  @ApiProperty({ description: 'Display order index', default: 0 })
  order_index: number;

  @ApiProperty({ required: false })
  createdAt?: Date;

  @ApiProperty({ required: false })
  updatedAt?: Date;
}

export const PostMediaSchema = SchemaFactory.createForClass(PostMedia);

PostMediaSchema.index({ post_id: 1, order_index: 1 });
