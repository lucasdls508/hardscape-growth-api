import { User } from "src/user/entities/user.entity";
import { PreSignedUrlDTO } from "./dto/pre-signed-url.dto";
import { S3Service } from "./s3.service";
export declare class S3Controller {
    private readonly s3Service;
    constructor(s3Service: S3Service);
    testConnection(): Promise<import("@aws-sdk/client-s3").Bucket[]>;
    getPreSignedUrl(preSignedUrlDto: PreSignedUrlDTO, user: User): Promise<{
        status: string;
        data: {
            url: string;
            key: string;
            method: string;
            expiresIn: string;
        };
    }>;
    delete(key: string): Promise<{
        status: string;
        data: true;
    } | {
        status: string;
        data: string;
    }>;
}
