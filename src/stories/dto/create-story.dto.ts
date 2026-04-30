import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { StoryMediaType } from '../schemas/story.schema';

export class CreateStoryDto {
  @ApiProperty({ required: false, default: '' })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  media_url?: string;

  @ApiProperty({ enum: StoryMediaType, required: false })
  @IsOptional()
  @IsEnum(StoryMediaType)
  media_type?: StoryMediaType;
}
