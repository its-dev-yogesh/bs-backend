import { ApiProperty } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type NotificationDocument = HydratedDocument<Notification>;

export enum NotificationType {
  CONNECTION_REQUEST = 'connection_request',
  POST_LIKE = 'post_like',
  COMMENT = 'comment',
  MENTION = 'mention',
  MESSAGE = 'message',
  REQUIREMENT_MATCH = 'requirement_match',
}

@Schema({ timestamps: true, collection: 'notifications' })
export class Notification {
  @Prop({ default: () => uuidv4() })
  @ApiProperty()
  _id?: string;

  @Prop({ required: true, index: true })
  @ApiProperty()
  user_id: string;

  @Prop({ required: true, enum: NotificationType, index: true })
  @ApiProperty({ enum: NotificationType })
  type: NotificationType;

  @Prop({ required: true })
  @ApiProperty()
  actor_id: string;

  @Prop({ default: false, index: true })
  @ApiProperty()
  read: boolean;

  @Prop()
  @ApiProperty({ required: false })
  link?: string;

  @ApiProperty({ required: false })
  createdAt?: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
NotificationSchema.index({ user_id: 1, createdAt: -1 });
