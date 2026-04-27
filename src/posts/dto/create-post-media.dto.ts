import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';
import { MediaType } from '../schemas/post-media.schema';

export class CreatePostMediaDto {
  @ApiProperty({ example: 'https://cdn.example.com/posts/abc.jpg' })
  @IsNotEmpty()
  url: string;

  @ApiProperty({ enum: MediaType })
  @IsEnum(MediaType)
  type: MediaType;

  @ApiProperty({ example: 0, required: false, default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  order_index?: number;
}
