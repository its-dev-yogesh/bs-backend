import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SendMessageDto {
  @ApiProperty()
  @IsNotEmpty()
  body: string;

  @ApiProperty({ required: false })
  @IsOptional()
  targetUserId?: string;

  /** Optional id of the post this DM is an inquiry about — drives lead creation. */
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  postId?: string;
}
