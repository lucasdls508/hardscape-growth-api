"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_s3_1 = require("@aws-sdk/client-s3");
const config_1 = require("@nestjs/config");
const configService = new config_1.ConfigService();
const s3 = new client_s3_1.S3Client({
    endpoint: configService.get("MINIO_ENDPOINT") || "http://localhost:9000",
    region: configService.get("AWS_REGION") || "us-east-1",
    credentials: {
        accessKeyId: configService.get("MINIO_ACCESS_KEY"),
        secretAccessKey: configService.get("MINIO_SECRET_KEY"),
    },
    forcePathStyle: true,
});
async function testConnection() {
    try {
        const result = await s3.send(new client_s3_1.ListBucketsCommand({}));
        console.log("Connection successful! Buckets:", result.Buckets);
    }
    catch (error) {
        console.error("Error connecting to MinIO:", error);
    }
}
testConnection();
//# sourceMappingURL=test.bucket.js.map