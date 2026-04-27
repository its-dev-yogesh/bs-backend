import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ example: 'Is this still available?' })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({
    description: 'Parent comment ID for replies',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  parent_id?: string | null;
}
