import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsIn, IsNotEmpty, IsOptional } from 'class-validator';
import { ReportStatus } from '../schemas/report.schema';

export class CreateReportDto {
  @ApiProperty({ enum: ['post', 'user'] })
  @IsIn(['post', 'user'])
  targetType: 'post' | 'user';

  @ApiProperty()
  @IsNotEmpty()
  targetId: string;

  @ApiProperty()
  @IsNotEmpty()
  reason: string;
}

export class ReviewReportDto {
  @ApiProperty({ enum: ReportStatus })
  @IsEnum(ReportStatus)
  status: ReportStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  note?: string;
}
