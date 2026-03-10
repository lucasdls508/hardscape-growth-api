"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multerS3Config = exports.s3 = exports.multerConfig = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const multer_s3_1 = __importDefault(require("multer-s3"));
const config_1 = require("@nestjs/config");
const configService = new config_1.ConfigService();
const multer_1 = require("multer");
const path_1 = require("path");
exports.multerConfig = {
    storage: (0, multer_1.diskStorage)({
        destination: (req, file, callback) => {
            const base = process.env.VERCEL ? "/tmp" : "public";
            const dir = `${base}/uploads/${new Date().toISOString().split("T")[0].replace(/-/g, "/")}`;
            require("fs").mkdirSync(dir, { recursive: true });
            callback(null, dir);
        },
        filename: (req, file, callback) => {
            console.log("ON MULTER", file);
            const uniqueSuffix = Math.round(Math.random() * 1e9);
            callback(null, file.fieldname + "-" + uniqueSuffix + (0, path_1.extname)(file.originalname));
        },
    }),
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
    fileFilter: (req, file, callback) => {
        const allowedMimes = [
            "image/jpeg",
            "image/png",
            "image/gif",
            "audio/mpeg",
            "audio/wav",
            "video/mp4",
            "video/webm",
            "video/ogg",
            "application/octet-stream",
        ];
        console.log(file);
        if (allowedMimes.includes(file.mimetype)) {
            callback(null, true);
        }
        else {
            callback(new Error("Invalid file type. Only image, audio, and video files are allowed"), false);
        }
    },
};
exports.s3 = new client_s3_1.S3Client({
    region: configService.get("AWS_REGION") || "us-east-1",
    credentials: {
        accessKeyId: configService.get("AWS_ACCESS_KEY_ID") || "access_key",
        secretAccessKey: configService.get("AWS_SECRET_ACCESS_KEY") || "secret_key",
    },
    endpoint: configService.get("AWS_ENDPOINT") || "http://172.17.0.4:9000",
    forcePathStyle: true,
});
console.log("AWS Access Key:", configService.get("AWS_ACCESS_KEY_ID"));
console.log("AWS Secret:", configService.get("AWS_SECRET_ACCESS_KEY"));
exports.multerS3Config = (0, multer_s3_1.default)({
    s3: exports.s3,
    bucket: configService.get("AWS_S3_BUCKET_NAME") || "mybucket",
    acl: "public-read",
    metadata: (req, file, callback) => {
        callback(null, { fieldName: file.fieldname });
    },
    key: (req, file, callback) => {
        console.log(req);
        const date = new Date().toISOString().split("T")[0].replace(/-/g, "/");
        const uniqueFileName = `${date}/${file.originalname}-${Date.now()}`;
        callback(null, uniqueFileName);
    },
});
//# sourceMappingURL=multer.config.js.map