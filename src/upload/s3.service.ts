import { Injectable, InternalServerErrorException, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';
import { extname } from 'path';

export interface UploadedFileResult {
  key: string;
  bucket: string;
  url: string;
  mime_type: string;
  size: number;
  original_name: string;
}

@Injectable()
export class S3Service implements OnModuleInit {
  private readonly logger = new Logger(S3Service.name);
  private client!: S3Client;
  private bucket!: string;
  private region!: string;
  private keyPrefix!: string;
  private publicUrlBase?: string;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    this.region = this.configService.get<string>('AWS_REGION', 'ap-south-1');
    this.bucket = this.configService.get<string>('AWS_S3_BUCKET_NAME', '');
    this.keyPrefix = (this.configService.get<string>('AWS_S3_KEY_PREFIX', '') || '')
      .replace(/^\/+|\/+$/g, '');
    this.publicUrlBase = this.configService.get<string>('AWS_S3_PUBLIC_URL') || undefined;

    const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>('AWS_SECRET_ACCESS_KEY');

    if (!this.bucket) {
      this.logger.warn('AWS_S3_BUCKET_NAME is not set — uploads will fail until configured.');
    }

    this.client = new S3Client({
      region: this.region,
      credentials:
        accessKeyId && secretAccessKey
          ? { accessKeyId, secretAccessKey }
          : undefined,
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    folder?: string,
  ): Promise<UploadedFileResult> {
    if (!file) {
      throw new InternalServerErrorException('No file provided');
    }
    if (!this.bucket) {
      throw new InternalServerErrorException('S3 bucket is not configured');
    }

    const key = this.buildKey(file.originalname, folder);

    try {
      await this.client.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
          ContentDisposition: `inline; filename="${this.sanitize(file.originalname)}"`,
        }),
      );
    } catch (err) {
      this.logger.error(`S3 upload failed for key ${key}`, err as Error);
      throw new InternalServerErrorException('Failed to upload file to S3');
    }

    return {
      key,
      bucket: this.bucket,
      url: this.buildPublicUrl(key),
      mime_type: file.mimetype,
      size: file.size,
      original_name: file.originalname,
    };
  }

  async uploadFiles(
    files: Express.Multer.File[],
    folder?: string,
  ): Promise<UploadedFileResult[]> {
    return Promise.all(files.map((file) => this.uploadFile(file, folder)));
  }

  async deleteFile(key: string): Promise<void> {
    if (!this.bucket) {
      throw new InternalServerErrorException('S3 bucket is not configured');
    }
    try {
      await this.client.send(
        new DeleteObjectCommand({ Bucket: this.bucket, Key: key }),
      );
    } catch (err) {
      this.logger.error(`S3 delete failed for key ${key}`, err as Error);
      throw new InternalServerErrorException('Failed to delete file from S3');
    }
  }

  async getSignedDownloadUrl(key: string, expiresInSeconds = 900): Promise<string> {
    return getSignedUrl(
      this.client,
      new GetObjectCommand({ Bucket: this.bucket, Key: key }),
      { expiresIn: expiresInSeconds },
    );
  }

  private buildKey(originalName: string, folder?: string): string {
    const ext = extname(originalName).toLowerCase();
    const base = randomUUID();
    const segments = [this.keyPrefix, folder?.replace(/^\/+|\/+$/g, ''), `${base}${ext}`]
      .filter((s): s is string => Boolean(s));
    return segments.join('/');
  }

  private buildPublicUrl(key: string): string {
    if (this.publicUrlBase) {
      return `${this.publicUrlBase.replace(/\/+$/, '')}/${key}`;
    }
    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
  }

  private sanitize(name: string): string {
    return name.replace(/[\r\n"]/g, '_');
  }
}
