export declare class UploadFolderDto {
    folder?: string;
}
export declare class UploadResponseDto {
    key: string;
    bucket: string;
    url: string;
    mime_type: string;
    size: number;
    original_name: string;
}
export declare class MultiUploadResponseDto {
    files: UploadResponseDto[];
}
