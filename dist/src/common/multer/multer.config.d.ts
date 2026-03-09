import { S3Client } from "@aws-sdk/client-s3";
export declare const multerConfig: {
    storage: import("multer").StorageEngine;
    limits: {
        fileSize: number;
    };
    fileFilter: (req: any, file: any, callback: any) => void;
};
export declare const s3: S3Client;
export declare const multerS3Config: any;
