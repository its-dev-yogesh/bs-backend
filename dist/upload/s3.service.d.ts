import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export interface UploadedFileResult {
    key: string;
    bucket: string;
    url: string;
    mime_type: string;
    size: number;
    original_name: string;
}
export declare class S3Service implements OnModuleInit {
    private readonly configService;
    private readonly logger;
    private client;
    private bucket;
    private region;
    private keyPrefix;
    private publicUrlBase?;
    constructor(configService: ConfigService);
    onModuleInit(): void;
    uploadFile(file: Express.Multer.File, folder?: string): Promise<UploadedFileResult>;
    uploadFiles(files: Express.Multer.File[], folder?: string): Promise<UploadedFileResult[]>;
    deleteFile(key: string): Promise<void>;
    getSignedDownloadUrl(key: string, expiresInSeconds?: number): Promise<string>;
    private buildKey;
    private buildPublicUrl;
    private sanitize;
}
