import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateConnectionRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  userId: string;
}
