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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const s3_service_1 = require("./s3.service");
const upload_dto_1 = require("./dto/upload.dto");
let UploadController = class UploadController {
    s3Service;
    constructor(s3Service) {
        this.s3Service = s3Service;
    }
    async uploadSingle(file, body) {
        if (!file) {
            throw new common_1.BadRequestException('file is required');
        }
        return this.s3Service.uploadFile(file, body.folder);
    }
    async uploadMultiple(files, body) {
        if (!files || files.length === 0) {
            throw new common_1.BadRequestException('files are required');
        }
        const uploaded = await this.s3Service.uploadFiles(files, body.folder);
        return { files: uploaded };
    }
    async uploadFields(files, body) {
        const [images, videos, documents] = await Promise.all([
            this.s3Service.uploadFiles(files.images ?? [], body.folder ? `${body.folder}/images` : 'images'),
            this.s3Service.uploadFiles(files.videos ?? [], body.folder ? `${body.folder}/videos` : 'videos'),
            this.s3Service.uploadFiles(files.documents ?? [], body.folder ? `${body.folder}/documents` : 'documents'),
        ]);
        return { images, videos, documents };
    }
    async remove(key) {
        await this.s3Service.deleteFile(key);
        return { deleted: true, key };
    }
};
exports.UploadController = UploadController;
__decorate([
    (0, common_1.Post)('single'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiOperation)({ summary: 'Upload a single file to S3 (any type)' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: { type: 'string', format: 'binary' },
                folder: { type: 'string', example: 'avatars' },
            },
            required: ['file'],
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 201, type: upload_dto_1.UploadResponseDto }),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, upload_dto_1.UploadFolderDto]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "uploadSingle", null);
__decorate([
    (0, common_1.Post)('multiple'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 20)),
    (0, swagger_1.ApiOperation)({ summary: 'Upload multiple files (same field name) to S3' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
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
    }),
    (0, swagger_1.ApiResponse)({ status: 201, type: upload_dto_1.MultiUploadResponseDto }),
    __param(0, (0, common_1.UploadedFiles)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, upload_dto_1.UploadFolderDto]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "uploadMultiple", null);
__decorate([
    (0, common_1.Post)('fields'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'images', maxCount: 10 },
        { name: 'videos', maxCount: 5 },
        { name: 'documents', maxCount: 10 },
    ], { limits: { fileSize: 100 * 1024 * 1024 } })),
    (0, swagger_1.ApiOperation)({
        summary: 'Upload mixed file types in named fields (images, videos, documents) to S3',
    }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                images: { type: 'array', items: { type: 'string', format: 'binary' } },
                videos: { type: 'array', items: { type: 'string', format: 'binary' } },
                documents: { type: 'array', items: { type: 'string', format: 'binary' } },
                folder: { type: 'string', example: 'mixed' },
            },
        },
    }),
    __param(0, (0, common_1.UploadedFiles)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, upload_dto_1.UploadFolderDto]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "uploadFields", null);
__decorate([
    (0, common_1.Delete)(':key(*)'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete an uploaded file from S3 by key' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'File deleted' }),
    __param(0, (0, common_1.Param)('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "remove", null);
exports.UploadController = UploadController = __decorate([
    (0, swagger_1.ApiTags)('Upload'),
    (0, swagger_1.ApiBearerAuth)('jwt-auth'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('upload'),
    __metadata("design:paramtypes", [s3_service_1.S3Service])
], UploadController);
//# sourceMappingURL=upload.controller.js.map