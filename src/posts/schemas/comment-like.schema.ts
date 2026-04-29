import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';

export type CommentLikeDocument = HydratedDocument<CommentLike>;

@Schema({ timestamps: true, collection: 'comment_likes' })
export class CommentLike {
  @Prop({ default: () => uuidv4() })
  @ApiProperty()
  _id?: string;

  @Prop({ required: true, type: String, index: true })
  @ApiProperty()
  comment_id: string;

  @Prop({ required: true, type: String, index: true })
  @ApiProperty()
  user_id: string;
}

export const CommentLikeSchema = SchemaFactory.createForClass(CommentLike);
CommentLikeSchema.index({ comment_id: 1, user_id: 1 }, { unique: true });
