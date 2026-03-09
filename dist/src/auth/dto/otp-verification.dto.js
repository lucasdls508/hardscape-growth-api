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
exports.OtpVerificationDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const otp_entity_1 = require("../../otp/entities/otp.entity");
class OtpVerificationDto {
}
exports.OtpVerificationDto = OtpVerificationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: true, description: "One Time Password Is Required" }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)({ message: "OTP must be a string" }),
    (0, class_validator_1.Length)(4, 4, { message: "OTP must be exactly 4 characters long" }),
    __metadata("design:type", String)
], OtpVerificationDto.prototype, "otp", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: true, description: "Verification type Is Required" }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(otp_entity_1.OtpType, { message: "Verification_type must be a valid " }),
    __metadata("design:type", String)
], OtpVerificationDto.prototype, "verification_type", void 0);
//# sourceMappingURL=otp-verification.dto.js.map