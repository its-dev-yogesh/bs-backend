"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultiUploadResponseDto = exports.UploadResponseDto = exports.UploadFolderDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UploadFolderDto {
    folder;
}
exports.UploadFolderDto = UploadFolderDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Optional sub-folder under the bucket prefix (e.g. "avatars", "posts/123")',
        example: 'avatars',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], UploadFolderDto.prototype, "folder", void 0);
class UploadResponseDto {
    key;
    bucket;
    url;
    mime_type;
    size;
    original_name;
}
exports.UploadResponseDto = UploadResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'S3 object key (path inside the bucket)' }),
    __metadata("design:type", String)
], UploadResponseDto.prototype, "key", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'S3 bucket name' }),
    __metadata("design:type", String)
], UploadResponseDto.prototype, "bucket", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Public URL to the uploaded file' }),
    __metadata("design:type", String)
], UploadResponseDto.prototype, "url", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'MIME type of the uploaded file' }),
    __metadata("design:type", String)
], UploadResponseDto.prototype, "mime_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'File size in bytes' }),
    __metadata("design:type", Number)
], UploadResponseDto.prototype, "size", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Original filename from the client' }),
    __metadata("design:type", String)
], UploadResponseDto.prototype, "original_name", void 0);
class MultiUploadResponseDto {
    files;
}
exports.MultiUploadResponseDto = MultiUploadResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [UploadResponseDto] }),
    __metadata("design:type", Array)
], MultiUploadResponseDto.prototype, "files", void 0);
//# sourceMappingURL=upload.dto.js.map