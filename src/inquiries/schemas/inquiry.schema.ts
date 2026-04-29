import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';

export type InquiryDocument = HydratedDocument<Inquiry>;

export enum InquiryStatus {
  NEW = 'new',
  CONTACTED = 'contacted',
  CLOSED = 'closed',
}

@Schema({ timestamps: true, collection: 'inquiries' })
export class Inquiry {
  @Prop({ default: () => uuidv4() })
  @ApiProperty({ description: 'MongoDB ID (UUID)' })
  _id?: string;

  @Prop({ required: true, type: String, index: true })
  @ApiProperty({ description: 'Post ID being inquired about' })
  post_id: string;

  @Prop({ required: true, type: String, index: true })
  @ApiProperty({
    description: 'Owner of the post (denormalized for fast lead lookup)',
  })
  post_owner_id: string;

  @Prop({ required: true, type: String, index: true })
  @ApiProperty({ description: 'User who initiated the inquiry' })
  user_id: string;

  @Prop()
  @ApiProperty({
    description: 'Optional message from the inquirer',
    required: false,
  })
  message?: string;

  @Prop({ enum: InquiryStatus, default: InquiryStatus.NEW, index: true })
  @ApiProperty({ enum: InquiryStatus, default: InquiryStatus.NEW })
  status: InquiryStatus;

  @ApiProperty({ required: false })
  createdAt?: Date;

  @ApiProperty({ required: false })
  updatedAt?: Date;
}

export const InquirySchema = SchemaFactory.createForClass(Inquiry);

InquirySchema.index({ post_id: 1, user_id: 1 }, { unique: true });
InquirySchema.index({ post_owner_id: 1, createdAt: -1 });
InquirySchema.index({ user_id: 1, createdAt: -1 });
