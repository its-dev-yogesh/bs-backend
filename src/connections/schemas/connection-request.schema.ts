import { ApiProperty } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type ConnectionRequestDocument = HydratedDocument<ConnectionRequest>;

export enum ConnectionRequestStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
}

@Schema({ timestamps: true, collection: 'connection_requests' })
export class ConnectionRequest {
  @Prop({ default: () => uuidv4() })
  @ApiProperty()
  _id?: string;

  @Prop({ required: true, index: true })
  @ApiProperty()
  from_user_id: string;

  @Prop({ required: true, index: true })
  @ApiProperty()
  to_user_id: string;

  @Prop({ required: true, enum: ConnectionRequestStatus, index: true })
  @ApiProperty({ enum: ConnectionRequestStatus })
  status: ConnectionRequestStatus;

  @ApiProperty({ required: false })
  createdAt?: Date;

  @ApiProperty({ required: false })
  updatedAt?: Date;
}

export const ConnectionRequestSchema =
  SchemaFactory.createForClass(ConnectionRequest);
ConnectionRequestSchema.index(
  { from_user_id: 1, to_user_id: 1 },
  { unique: true },
);
