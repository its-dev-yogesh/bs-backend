import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { KycStatus } from '../schemas/kyc-request.schema';

export class SubmitKycDto {
  @ApiProperty()
  @IsNotEmpty()
  panNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  aadhaarNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  panDocUrl: string;

  @ApiProperty()
  @IsNotEmpty()
  aadhaarDocUrl: string;
}

export class ReviewKycDto {
  @ApiProperty({ enum: KycStatus })
  @IsEnum(KycStatus)
  status: KycStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  adminNote?: string;
}
