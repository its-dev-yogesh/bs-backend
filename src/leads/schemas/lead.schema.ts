import { ApiProperty } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type LeadDocument = HydratedDocument<Lead>;

export enum LeadStatus {
  NEW = 'new',
  CONTACTED = 'contacted',
  CONVERTED = 'converted',
  CLOSED = 'closed',
}

@Schema({ timestamps: true, collection: 'leads' })
export class Lead {
  @Prop({ default: () => uuidv4() })
  @ApiProperty()
  _id?: string;

  @Prop({ required: true, index: true })
  @ApiProperty()
  broker_user_id: string;

  @Prop({ required: true, index: true })
  @ApiProperty()
  client_user_id: string;

  @Prop()
  @ApiProperty({ required: false })
  post_id?: string;

  @Prop({ required: true, enum: LeadStatus, default: LeadStatus.NEW, index: true })
  @ApiProperty({ enum: LeadStatus })
  status: LeadStatus;
}

export const LeadSchema = SchemaFactory.createForClass(Lead);
