import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';

export type FollowDocument = HydratedDocument<Follow>;

@Schema({
  timestamps: { createdAt: true, updatedAt: false },
  collection: 'follows',
})
export class Follow {
  @Prop({ default: () => uuidv4() })
  @ApiProperty({ description: 'MongoDB ID (UUID)' })
  _id?: string;

  @Prop({ required: true, type: String, index: true })
  @ApiProperty({ description: 'Follower user ID' })
  follower_id: string;

  @Prop({ required: true, type: String, index: true })
  @ApiProperty({ description: 'Followee user ID' })
  followee_id: string;

  @ApiProperty({ required: false })
  createdAt?: Date;
}

export const FollowSchema = SchemaFactory.createForClass(Follow);

FollowSchema.index({ follower_id: 1, followee_id: 1 }, { unique: true });
FollowSchema.index({ followee_id: 1, createdAt: -1 });
