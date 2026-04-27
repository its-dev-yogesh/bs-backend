import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';

export type ReactionDocument = HydratedDocument<Reaction>;

export enum ReactionType {
  LIKE = 'like',
  INTERESTED = 'interested',
}

@Schema({
  timestamps: { createdAt: true, updatedAt: false },
  collection: 'reactions',
})
export class Reaction {
  @Prop({ default: () => uuidv4() })
  @ApiProperty({ description: 'MongoDB ID (UUID)' })
  _id?: string;

  @Prop({ required: true, type: String, index: true })
  @ApiProperty({ description: 'User ID' })
  user_id: string;

  @Prop({ required: true, type: String, index: true })
  @ApiProperty({ description: 'Post ID' })
  post_id: string;

  @Prop({ required: true, enum: ReactionType })
  @ApiProperty({ enum: ReactionType })
  type: ReactionType;

  @ApiProperty({ required: false })
  createdAt?: Date;
}

export const ReactionSchema = SchemaFactory.createForClass(Reaction);

ReactionSchema.index({ user_id: 1, post_id: 1 }, { unique: true });
ReactionSchema.index({ post_id: 1, type: 1 });
