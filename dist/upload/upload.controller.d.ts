import { S3Service } from './s3.service';
import { MultiUploadResponseDto, UploadFolderDto, UploadResponseDto } from './dto/upload.dto';
export declare class UploadController {
    private readonly s3Service;
    constructor(s3Service: S3Service);
    uploadSingle(file: Express.Multer.File, body: UploadFolderDto): Promise<UploadResponseDto>;
    uploadMultiple(files: Express.Multer.File[], body: UploadFolderDto): Promise<MultiUploadResponseDto>;
    uploadFields(files: {
        images?: Express.Multer.File[];
        videos?: Express.Multer.File[];
        documents?: Express.Multer.File[];
    }, body: UploadFolderDto): Promise<{
        images: UploadResponseDto[];
        videos: UploadResponseDto[];
        documents: UploadResponseDto[];
    }>;
    remove(key: string): Promise<{
        deleted: boolean;
        key: string;
    }>;
}
