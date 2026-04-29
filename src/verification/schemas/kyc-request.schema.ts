import { ApiProperty } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type KycRequestDocument = HydratedDocument<KycRequest>;

export enum KycStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Schema({ timestamps: true, collection: 'kyc_requests' })
export class KycRequest {
  @Prop({ default: () => uuidv4() })
  @ApiProperty()
  _id?: string;

  @Prop({ required: true, index: true })
  @ApiProperty()
  user_id: string;

  @Prop({ required: true })
  @ApiProperty()
  pan_number: string;

  @Prop({ required: true })
  @ApiProperty()
  aadhaar_number: string;

  @Prop({ required: true })
  @ApiProperty()
  pan_doc_url: string;

  @Prop({ required: true })
  @ApiProperty()
  aadhaar_doc_url: string;

  @Prop({ enum: KycStatus, default: KycStatus.PENDING, index: true })
  @ApiProperty({ enum: KycStatus })
  status: KycStatus;

  @Prop()
  @ApiProperty({ required: false })
  admin_note?: string;
}

export const KycRequestSchema = SchemaFactory.createForClass(KycRequest);
