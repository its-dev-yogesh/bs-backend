import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateInquiryDto {
  @ApiProperty({
    description: 'Optional message from the inquirer',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  message?: string;
}
