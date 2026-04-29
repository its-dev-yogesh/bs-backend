import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { LeadStatus } from '../schemas/lead.schema';

export class CreateLeadDto {
  @ApiProperty()
  @IsNotEmpty()
  clientUserId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  postId?: string;
}

export class UpdateLeadStatusDto {
  @ApiProperty({ enum: LeadStatus })
  @IsEnum(LeadStatus)
  status: LeadStatus;
}
