import { PrimaryPaths, S3_Field } from "../enums/primary-path.enum";
export declare class PreSignedUrlDTO {
    fileName: string;
    primaryPath: PrimaryPaths;
    field: S3_Field;
    expiresIn?: number;
}
