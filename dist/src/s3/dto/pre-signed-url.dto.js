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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreSignedUrlDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const primary_path_enum_1 = require("../enums/primary-path.enum");
class PreSignedUrlDTO {
}
exports.PreSignedUrlDTO = PreSignedUrlDTO;
__decorate([
    (0, swagger_1.ApiProperty)({ required: true, description: "upload file name" }),
    (0, class_validator_1.MaxLength)(500),
    (0, class_validator_1.MinLength)(1),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], PreSignedUrlDTO.prototype, "fileName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: true, description: "Primary path name of the files", enum: primary_path_enum_1.PrimaryPaths }),
    (0, class_validator_1.IsEnum)(primary_path_enum_1.PrimaryPaths, {
        message: `primaryPath must be one of the following values: ${Object.values(primary_path_enum_1.PrimaryPaths).join(", ")}`,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], PreSignedUrlDTO.prototype, "primaryPath", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: true, description: "S3 Field Name", enum: primary_path_enum_1.S3_Field }),
    (0, class_validator_1.IsEnum)(primary_path_enum_1.S3_Field, {
        message: `field must be one of the following values: ${Object.values(primary_path_enum_1.S3_Field).join(", ")}`,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], PreSignedUrlDTO.prototype, "field", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: "no of secs for which the s3 url should be live" }),
    (0, class_validator_1.Max)(900, { message: "URL can be live for maximum 15 mins or 900 secs" }),
    (0, class_validator_1.Min)(60, { message: "URL must be live for 60 secs" }),
    (0, class_validator_1.IsPositive)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => +value),
    __metadata("design:type", Number)
], PreSignedUrlDTO.prototype, "expiresIn", void 0);
//# sourceMappingURL=pre-signed-url.dto.js.map