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
var S3Service_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3Service = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const client_s3_1 = require("@aws-sdk/client-s3");
const client_s3_2 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const crypto_1 = require("crypto");
const path_1 = require("path");
let S3Service = S3Service_1 = class S3Service {
    configService;
    logger = new common_1.Logger(S3Service_1.name);
    client;
    bucket;
    region;
    keyPrefix;
    publicUrlBase;
    constructor(configService) {
        this.configService = configService;
    }
    onModuleInit() {
        this.region = this.configService.get('AWS_REGION', 'ap-south-1');
        this.bucket = this.configService.get('AWS_S3_BUCKET', '');
        this.keyPrefix = (this.configService.get('AWS_S3_KEY_PREFIX', '') || '')
            .replace(/^\/+|\/+$/g, '');
        this.publicUrlBase = this.configService.get('AWS_S3_PUBLIC_URL') || undefined;
        const accessKeyId = this.configService.get('AWS_ACCESS_KEY_ID');
        const secretAccessKey = this.configService.get('AWS_SECRET_ACCESS_KEY');
        if (!this.bucket) {
            this.logger.warn('AWS_S3_BUCKET is not set — uploads will fail until configured.');
        }
        this.client = new client_s3_1.S3Client({
            region: this.region,
            credentials: accessKeyId && secretAccessKey
                ? { accessKeyId, secretAccessKey }
                : undefined,
        });
    }
    async uploadFile(file, folder) {
        if (!file) {
            throw new common_1.InternalServerErrorException('No file provided');
        }
        if (!this.bucket) {
            throw new common_1.InternalServerErrorException('S3 bucket is not configured');
        }
        const key = this.buildKey(file.originalname, folder);
        try {
            await this.client.send(new client_s3_1.PutObjectCommand({
                Bucket: this.bucket,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype,
                ContentDisposition: `inline; filename="${this.sanitize(file.originalname)}"`,
            }));
        }
        catch (err) {
            this.logger.error(`S3 upload failed for key ${key}`, err);
            throw new common_1.InternalServerErrorException('Failed to upload file to S3');
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
    async uploadFiles(files, folder) {
        return Promise.all(files.map((file) => this.uploadFile(file, folder)));
    }
    async deleteFile(key) {
        if (!this.bucket) {
            throw new common_1.InternalServerErrorException('S3 bucket is not configured');
        }
        try {
            await this.client.send(new client_s3_1.DeleteObjectCommand({ Bucket: this.bucket, Key: key }));
        }
        catch (err) {
            this.logger.error(`S3 delete failed for key ${key}`, err);
            throw new common_1.InternalServerErrorException('Failed to delete file from S3');
        }
    }
    async getSignedDownloadUrl(key, expiresInSeconds = 900) {
        return (0, s3_request_presigner_1.getSignedUrl)(this.client, new client_s3_2.GetObjectCommand({ Bucket: this.bucket, Key: key }), { expiresIn: expiresInSeconds });
    }
    buildKey(originalName, folder) {
        const ext = (0, path_1.extname)(originalName).toLowerCase();
        const base = (0, crypto_1.randomUUID)();
        const segments = [this.keyPrefix, folder?.replace(/^\/+|\/+$/g, ''), `${base}${ext}`]
            .filter((s) => Boolean(s));
        return segments.join('/');
    }
    buildPublicUrl(key) {
        if (this.publicUrlBase) {
            return `${this.publicUrlBase.replace(/\/+$/, '')}/${key}`;
        }
        return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
    }
    sanitize(name) {
        return name.replace(/[\r\n"]/g, '_');
    }
};
exports.S3Service = S3Service;
exports.S3Service = S3Service = S3Service_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], S3Service);
//# sourceMappingURL=s3.service.js.map