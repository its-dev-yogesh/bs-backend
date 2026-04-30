import { ApiProperty } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type StoryDocument = HydratedDocument<Story>;

export enum StoryMediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  DOCUMENT = 'document',
}

@Schema({ timestamps: true, collection: 'stories' })
export class Story {
  @Prop({ default: () => uuidv4() })
  @ApiProperty()
  _id?: string;

  @Prop({ required: true, index: true })
  @ApiProperty()
  user_id: string;

  @Prop({ default: '' })
  @ApiProperty()
  content: string;

  @Prop()
  @ApiProperty({ required: false })
  media_url?: string;

  @Prop({ enum: StoryMediaType })
  @ApiProperty({ enum: StoryMediaType, required: false })
  media_type?: StoryMediaType;

  @ApiProperty({ required: false })
  createdAt?: Date;

  @ApiProperty({ required: false })
  updatedAt?: Date;
}

export const StorySchema = SchemaFactory.createForClass(Story);
/** TTL: stories auto-delete 24h after creation. */
StorySchema.index({ createdAt: 1 }, { expireAfterSeconds: 24 * 60 * 60 });
