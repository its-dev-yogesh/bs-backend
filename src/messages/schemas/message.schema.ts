import { ApiProperty } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type MessageDocument = HydratedDocument<Message>;

@Schema({ timestamps: { createdAt: true, updatedAt: false }, collection: 'messages' })
export class Message {
  @Prop({ default: () => uuidv4() })
  @ApiProperty()
  _id?: string;

  @Prop({ required: true, index: true })
  @ApiProperty()
  thread_id: string;

  @Prop({ required: true, index: true })
  @ApiProperty()
  sender_id: string;

  @Prop({ required: true })
  @ApiProperty()
  body: string;

  @Prop({ default: false })
  @ApiProperty()
  read: boolean;

  @ApiProperty({ required: false })
  createdAt?: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
MessageSchema.index({ thread_id: 1, createdAt: -1 });
