import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';

export type CommentReactionDocument = HydratedDocument<CommentReaction>;

export enum CommentReactionType {
  LIKE = 'like',
}

@Schema({
  timestamps: { createdAt: true, updatedAt: false },
  collection: 'comment_reactions',
})
export class CommentReaction {
  @Prop({ default: () => uuidv4() })
  @ApiProperty({ description: 'MongoDB ID (UUID)' })
  _id?: string;

  @Prop({ required: true, type: String, index: true })
  @ApiProperty({ description: 'User ID' })
  user_id: string;

  @Prop({ required: true, type: String, index: true })
  @ApiProperty({ description: 'Comment ID' })
  comment_id: string;

  @Prop({ required: true, enum: CommentReactionType })
  @ApiProperty({ enum: CommentReactionType })
  type: CommentReactionType;

  @ApiProperty({ required: false })
  createdAt?: Date;
}

export const CommentReactionSchema =
  SchemaFactory.createForClass(CommentReaction);

CommentReactionSchema.index({ user_id: 1, comment_id: 1 }, { unique: true });
CommentReactionSchema.index({ comment_id: 1, type: 1 });
