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
exports.UpdateVerificationDto = exports.CreateVerificationDto = exports.AccountStatus = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var AccountStatus;
(function (AccountStatus) {
    AccountStatus["INACTIVE"] = "inactive";
    AccountStatus["ACTIVE"] = "active";
    AccountStatus["BLOCKED"] = "blocked";
    AccountStatus["SUSPENDED"] = "suspended";
    AccountStatus["REJECTED"] = "rejected";
})(AccountStatus || (exports.AccountStatus = AccountStatus = {}));
class CreateVerificationDto {
}
exports.CreateVerificationDto = CreateVerificationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: "User ID associated with the verification" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVerificationDto.prototype, "user_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Indicates if the email is verified", default: false }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateVerificationDto.prototype, "is_email_verified", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Indicates if the seller is verified", default: false }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateVerificationDto.prototype, "is_admin_verified", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Indicates if the seller is verified", default: false }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateVerificationDto.prototype, "is_suspended", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Indicates if the record is deleted", default: false }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateVerificationDto.prototype, "is_deleted", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(AccountStatus),
    (0, swagger_1.ApiProperty)({
        enum: AccountStatus,
        default: [AccountStatus.INACTIVE],
        description: `String array, containing enum values, either ${AccountStatus.ACTIVE} or ${AccountStatus.INACTIVE}`,
    }),
    __metadata("design:type", String)
], CreateVerificationDto.prototype, "status", void 0);
class UpdateVerificationDto {
}
exports.UpdateVerificationDto = UpdateVerificationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: "User ID associated with the verification", required: false }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], UpdateVerificationDto.prototype, "user_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Indicates if the email is verified", default: false, required: false }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateVerificationDto.prototype, "is_email_verified", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Indicates if the seller is verified", default: false, required: false }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateVerificationDto.prototype, "is_seller_verified", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Indicates if the record is deleted", default: false, required: false }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateVerificationDto.prototype, "is_deleted", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Status of the verification", default: "active", required: false }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateVerificationDto.prototype, "status", void 0);
//# sourceMappingURL=verification-dto.js.map