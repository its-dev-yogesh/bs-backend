import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';

export type SavedPostDocument = HydratedDocument<SavedPost>;

@Schema({
  timestamps: { createdAt: true, updatedAt: false },
  collection: 'saved_posts',
})
export class SavedPost {
  @Prop({ default: () => uuidv4() })
  @ApiProperty({ description: 'MongoDB ID (UUID)' })
  _id?: string;

  @Prop({ required: true, type: String, index: true })
  @ApiProperty({ description: 'User ID' })
  user_id: string;

  @Prop({ required: true, type: String, index: true })
  @ApiProperty({ description: 'Post ID' })
  post_id: string;

  @ApiProperty({ required: false })
  createdAt?: Date;
}

export const SavedPostSchema = SchemaFactory.createForClass(SavedPost);

SavedPostSchema.index({ user_id: 1, post_id: 1 }, { unique: true });
SavedPostSchema.index({ user_id: 1, createdAt: -1 });
