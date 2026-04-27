import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';

export type CommentDocument = HydratedDocument<Comment>;

@Schema({ timestamps: true, collection: 'comments' })
export class Comment {
  @Prop({ default: () => uuidv4() })
  @ApiProperty({ description: 'MongoDB ID (UUID)' })
  _id?: string;

  @Prop({ required: true, type: String, index: true })
  @ApiProperty({ description: 'Post ID' })
  post_id: string;

  @Prop({ required: true, type: String, index: true })
  @ApiProperty({ description: 'Author user ID' })
  user_id: string;

  @Prop({ type: String, default: null, index: true })
  @ApiProperty({
    description: 'Parent comment ID for threaded replies',
    required: false,
    nullable: true,
  })
  parent_id?: string | null;

  @Prop({ required: true })
  @ApiProperty({ description: 'Comment content' })
  content: string;

  @ApiProperty({ required: false })
  createdAt?: Date;

  @ApiProperty({ required: false })
  updatedAt?: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

CommentSchema.index({ post_id: 1, createdAt: -1 });
CommentSchema.index({ post_id: 1, parent_id: 1, createdAt: 1 });
