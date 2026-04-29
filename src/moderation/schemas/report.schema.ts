import { ApiProperty } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type ReportDocument = HydratedDocument<Report>;

export enum ReportStatus {
  OPEN = 'open',
  REVIEWED = 'reviewed',
  ACTIONED = 'actioned',
  REJECTED = 'rejected',
}

@Schema({ timestamps: true, collection: 'reports' })
export class Report {
  @Prop({ default: () => uuidv4() })
  @ApiProperty()
  _id?: string;

  @Prop({ required: true, index: true })
  @ApiProperty()
  reporter_user_id: string;

  @Prop({ required: true })
  @ApiProperty()
  target_type: 'post' | 'user';

  @Prop({ required: true, index: true })
  @ApiProperty()
  target_id: string;

  @Prop({ required: true })
  @ApiProperty()
  reason: string;

  @Prop({ enum: ReportStatus, default: ReportStatus.OPEN, index: true })
  @ApiProperty({ enum: ReportStatus })
  status: ReportStatus;

  @Prop()
  @ApiProperty({ required: false })
  action_note?: string;
}

export const ReportSchema = SchemaFactory.createForClass(Report);
