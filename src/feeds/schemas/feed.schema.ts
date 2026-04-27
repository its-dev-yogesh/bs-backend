import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';

export type FeedDocument = HydratedDocument<Feed>;

@Schema({
  timestamps: { createdAt: true, updatedAt: false },
  collection: 'feeds',
})
export class Feed {
  @Prop({ default: () => uuidv4() })
  @ApiProperty({ description: 'Feed entry ID (UUID)' })
  _id?: string;

  @Prop({ required: true, type: String, index: true })
  @ApiProperty({ description: 'Owner user ID' })
  user_id: string;

  @Prop({ required: true, type: String, index: true })
  @ApiProperty({ description: 'Post ID this entry points to' })
  post_id: string;

  @Prop({ required: true, type: Number, default: 0 })
  @ApiProperty({ description: 'Ranking score (higher = surfaced first)' })
  score: number;

  @ApiProperty({ required: false })
  createdAt?: Date;
}

export const FeedSchema = SchemaFactory.createForClass(Feed);

FeedSchema.index({ user_id: 1, post_id: 1 }, { unique: true });
FeedSchema.index({ user_id: 1, score: -1, createdAt: -1 });
