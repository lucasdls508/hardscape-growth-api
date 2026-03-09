import { ConfigService } from "@nestjs/config";
import { User } from "src/user/entities/user.entity";
import { Logger } from "winston";
import { PrimaryPaths } from "./enums/primary-path.enum";
export declare class S3Service {
    private readonly configService;
    private readonly logger;
    private s3;
    private publicBaseUrl;
    constructor(configService: ConfigService, logger: Logger);
    testConnection(): Promise<import("@aws-sdk/client-s3").Bucket[]>;
    getPreSignedUrl(fileName: string, primaryPath: PrimaryPaths, expiresIn: number, field: string, user: User): Promise<{
        url: string;
        key: string;
        method: string;
        expiresIn: string;
    }>;
    removeCredentialFromUrl(url: string): string;
    deleteObject(imageName: string): Promise<boolean>;
    uploadHtml(estimateId: number, html: string): Promise<string>;
}
