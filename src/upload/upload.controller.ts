import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { S3Service } from './s3.service';
import {
  MultiUploadResponseDto,
  UploadFolderDto,
  UploadResponseDto,
} from './dto/upload.dto';

@ApiTags('Upload')
@ApiBearerAuth('jwt-auth')
@UseGuards(JwtAuthGuard)
@Controller('upload')
export class UploadController {
  constructor(private readonly s3Service: S3Service) {}

  @Post('single')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a single file to S3 (any type)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        folder: { type: 'string', example: 'avatars' },
      },
      required: ['file'],
    },
  })
  @ApiResponse({ status: 201, type: UploadResponseDto })
  async uploadSingle(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UploadFolderDto,
  ): Promise<UploadResponseDto> {
    if (!file) {
      throw new BadRequestException('file is required');
    }
    return this.s3Service.uploadFile(file, body.folder);
  }

  @Post('multiple')
  @UseInterceptors(FilesInterceptor('files', 20))
  @ApiOperation({ summary: 'Upload multiple files (same field name) to S3' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
        folder: { type: 'string', example: 'posts/123' },
      },
      required: ['files'],
    },
  })
  @ApiResponse({ status: 201, type: MultiUploadResponseDto })
  async uploadMultiple(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: UploadFolderDto,
  ): Promise<MultiUploadResponseDto> {
    if (!files || files.length === 0) {
      throw new BadRequestException('files are required');
    }
    const uploaded = await this.s3Service.uploadFiles(files, body.folder);
    return { files: uploaded };
  }

  @Post('fields')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'images', maxCount: 10 },
        { name: 'videos', maxCount: 5 },
        { name: 'documents', maxCount: 10 },
      ],
      { limits: { fileSize: 100 * 1024 * 1024 } },
    ),
  )
  @ApiOperation({
    summary:
      'Upload mixed file types in named fields (images, videos, documents) to S3',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        images: { type: 'array', items: { type: 'string', format: 'binary' } },
        videos: { type: 'array', items: { type: 'string', format: 'binary' } },
        documents: { type: 'array', items: { type: 'string', format: 'binary' } },
        folder: { type: 'string', example: 'mixed' },
      },
    },
  })
  async uploadFields(
    @UploadedFiles()
    files: {
      images?: Express.Multer.File[];
      videos?: Express.Multer.File[];
      documents?: Express.Multer.File[];
    },
    @Body() body: UploadFolderDto,
  ): Promise<{
    images: UploadResponseDto[];
    videos: UploadResponseDto[];
    documents: UploadResponseDto[];
  }> {
    const [images, videos, documents] = await Promise.all([
      this.s3Service.uploadFiles(
        files.images ?? [],
        body.folder ? `${body.folder}/images` : 'images',
      ),
      this.s3Service.uploadFiles(
        files.videos ?? [],
        body.folder ? `${body.folder}/videos` : 'videos',
      ),
      this.s3Service.uploadFiles(
        files.documents ?? [],
        body.folder ? `${body.folder}/documents` : 'documents',
      ),
    ]);
    return { images, videos, documents };
  }

  @Delete('*key')
  @ApiOperation({ summary: 'Delete an uploaded file from S3 by key' })
  @ApiResponse({ status: 200, description: 'File deleted' })
  async remove(@Param('key') key: string): Promise<{ deleted: boolean; key: string }> {
    await this.s3Service.deleteFile(key);
    return { deleted: true, key };
  }
}
