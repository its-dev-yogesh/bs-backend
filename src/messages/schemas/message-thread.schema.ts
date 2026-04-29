import { ApiProperty } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type MessageThreadDocument = HydratedDocument<MessageThread>;

@Schema({ timestamps: true, collection: 'message_threads' })
export class MessageThread {
  @Prop({ default: () => uuidv4() })
  @ApiProperty()
  _id?: string;

  @Prop({ required: true, type: [String], index: true })
  @ApiProperty({ type: [String] })
  participant_ids: string[];

  @Prop()
  @ApiProperty({ required: false })
  post_id?: string;

  @Prop()
  @ApiProperty({ required: false })
  listing_id?: string;

  @Prop()
  @ApiProperty({ required: false })
  last_message?: string;

  @Prop({ type: Date })
  @ApiProperty({ required: false })
  last_message_at?: Date;
}

export const MessageThreadSchema = SchemaFactory.createForClass(MessageThread);
MessageThreadSchema.index({ participant_ids: 1, updatedAt: -1 });
