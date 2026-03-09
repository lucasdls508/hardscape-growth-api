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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var S3Service_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3Service = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mime_types_1 = __importDefault(require("mime-types"));
const logger_decorator_1 = require("../shared/decorators/logger.decorator");
const winston_1 = require("winston");
let S3Service = S3Service_1 = class S3Service {
    constructor(configService, logger) {
        this.configService = configService;
        this.logger = logger;
        this.s3 = new client_s3_1.S3Client({
            endpoint: this.configService.get("AWS_ENDPOINT"),
            region: this.configService.get("AWS_REGION"),
            credentials: {
                accessKeyId: this.configService.get("AWS_ACCESS_KEY_ID"),
                secretAccessKey: this.configService.get("AWS_SECRET_ACCESS_KEY"),
            },
            forcePathStyle: true,
        });
    }
    async testConnection() {
        try {
            const result = await this.s3.send(new client_s3_1.ListBucketsCommand({}));
            this.logger.log("MinIO Connection Successful! Buckets:", result.Buckets);
            return result.Buckets;
        }
        catch (error) {
            this.logger.error("Failed to connect to MinIO:", error);
            throw error;
        }
    }
    async getPreSignedUrl(fileName, primaryPath, expiresIn = 300, field, user) {
        this.logger.log(`Generating pre-signed URL for file ${fileName}`, S3Service_1.name);
        const date = new Date().toISOString().split("T")[0].replace(/-/g, "/");
        const fileNameArr = fileName.split(".");
        const originalFileName = fileNameArr[0].replace(/[^a-zA-Z0-9]/g, "_");
        const contentType = mime_types_1.default.lookup(fileName) || "application/octet-stream";
        const imageName = `${primaryPath}/${date}/${originalFileName}-${Date.now()}.${fileNameArr[fileNameArr.length - 1]}`;
        console.log("Content Type:", contentType);
        const params = {
            Bucket: this.configService.get("AWS_PUBLIC_BUCKET_NAME"),
            Key: imageName,
            ContentType: contentType,
            ContentDisposition: "inline",
            Metadata: {
                user_id: user.id,
                field: field,
                source: "webhook",
            },
        };
        const command = new client_s3_1.PutObjectCommand(params);
        const url = await (0, s3_request_presigner_1.getSignedUrl)(this.s3, command, { expiresIn });
        return {
            url: this.removeCredentialFromUrl(url),
            key: imageName,
            method: "PUT",
            expiresIn: `${expiresIn}s`,
        };
    }
    removeCredentialFromUrl(url) {
        const urlObj = new URL(url);
        const searchParams = urlObj.searchParams;
        searchParams.delete("X-Amz-Credential");
        urlObj.search = searchParams.toString();
        return urlObj.toString();
    }
    async deleteObject(imageName) {
        this.logger.log(`Deleting file ${imageName}`, S3Service_1.name);
        try {
            const params = {
                Bucket: this.configService.get("AWS_PUBLIC_BUCKET_NAME"),
                Key: imageName,
            };
            const command = new client_s3_1.DeleteObjectCommand(params);
            const result = await this.s3.send(command);
            const isSuccess = result.DeleteMarker === true || result.$metadata?.httpStatusCode === 204;
            if (isSuccess) {
                this.logger.log(`Successfully deleted ${imageName}`, S3Service_1.name);
                return true;
            }
            else {
                this.logger.warn(`Deletion of ${imageName} may not have been successful`, S3Service_1.name);
                return false;
            }
        }
        catch (error) {
            this.logger.error(`Failed to delete object ${imageName}: ${error.message}`, error.stack, S3Service_1.name);
            throw new client_s3_1.S3ServiceException({
                message: `Failed to delete file: ${error.message}`,
                name: "S3DeleteObjectError",
                $fault: "client",
                $metadata: error.$metadata || {},
            });
        }
    }
    async uploadHtml(estimateId, html) {
        const key = `estimates/${estimateId}/sign.html`;
        await this.s3.send(new client_s3_1.PutObjectCommand({
            Bucket: this.configService.get("AWS_PUBLIC_BUCKET_NAME"),
            Key: key,
            Body: Buffer.from(html, "utf-8"),
            ContentType: "text/html; charset=utf-8",
            ACL: "public-read",
            CacheControl: "no-cache, no-store",
        }));
        const url = `${this.publicBaseUrl}/${key}`;
        this.logger.log(`Estimate #${estimateId} uploaded → ${url}`, estimateId);
        return url;
    }
};
exports.S3Service = S3Service;
exports.S3Service = S3Service = S3Service_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, logger_decorator_1.InjectLogger)()),
    __metadata("design:paramtypes", [config_1.ConfigService,
        winston_1.Logger])
], S3Service);
//# sourceMappingURL=s3.service.js.map