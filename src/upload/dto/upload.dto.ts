import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UploadFolderDto {
  @ApiPropertyOptional({
    description: 'Optional sub-folder under the bucket prefix (e.g. "avatars", "posts/123")',
    example: 'avatars',
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  folder?: string;
}

export class UploadResponseDto {
  @ApiProperty({ description: 'S3 object key (path inside the bucket)' })
  key!: string;

  @ApiProperty({ description: 'S3 bucket name' })
  bucket!: string;

  @ApiProperty({ description: 'Public URL to the uploaded file' })
  url!: string;

  @ApiProperty({ description: 'MIME type of the uploaded file' })
  mime_type!: string;

  @ApiProperty({ description: 'File size in bytes' })
  size!: number;

  @ApiProperty({ description: 'Original filename from the client' })
  original_name!: string;
}

export class MultiUploadResponseDto {
  @ApiProperty({ type: [UploadResponseDto] })
  files!: UploadResponseDto[];
}
