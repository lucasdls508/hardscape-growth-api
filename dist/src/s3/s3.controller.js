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
exports.S3Controller = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const get_user_decorator_1 = require("../auth/decorators/get-user.decorator");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const user_entity_1 = require("../user/entities/user.entity");
const pre_signed_url_dto_1 = require("./dto/pre-signed-url.dto");
const s3_service_1 = require("./s3.service");
let S3Controller = class S3Controller {
    constructor(s3Service) {
        this.s3Service = s3Service;
    }
    async testConnection() {
        return await this.s3Service.testConnection();
    }
    async getPreSignedUrl(preSignedUrlDto, user) {
        const { fileName, primaryPath, expiresIn, field } = preSignedUrlDto;
        const result = await this.s3Service.getPreSignedUrl(fileName, primaryPath, expiresIn, field, { ...user });
        return { status: "success", data: result };
    }
    async delete(key) {
        const result = await this.s3Service.deleteObject(key);
        return result === true
            ? { status: "success", data: result }
            : { status: "failed", data: "File Not Deleted" };
    }
};
exports.S3Controller = S3Controller;
__decorate([
    (0, common_1.Get)("test-connection"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], S3Controller.prototype, "testConnection", null);
__decorate([
    (0, common_1.Get)("pre-signed-url"),
    (0, swagger_1.ApiOperation)({
        summary: "Generate S3 Pre-Signed URL",
        description: "Generates a pre-signed URL for accessing an S3 object. The URL can be used for uploading or downloading a file from S3 with a specified expiration time.",
    }),
    (0, swagger_1.ApiOkResponse)({ description: "Get S3 pre-signed URL" }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pre_signed_url_dto_1.PreSignedUrlDTO, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], S3Controller.prototype, "getPreSignedUrl", null);
__decorate([
    (0, common_1.Delete)("delete/:key"),
    (0, swagger_1.ApiOperation)({
        summary: "Delete S3 Object",
        description: "Deletes an object from S3 based on the provided key. Returns a success status if the deletion is successful, otherwise indicates failure.",
    }),
    (0, swagger_1.ApiOkResponse)({ description: "Delete S3 object" }),
    __param(0, (0, common_1.Param)("key")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], S3Controller.prototype, "delete", null);
exports.S3Controller = S3Controller = __decorate([
    (0, swagger_1.ApiTags)("S3"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)("s3"),
    __metadata("design:paramtypes", [s3_service_1.S3Service])
], S3Controller);
//# sourceMappingURL=s3.controller.js.map