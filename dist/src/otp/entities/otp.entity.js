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
exports.Otp = exports.OtpType = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const user_entity_1 = require("../../user/entities/user.entity");
const typeorm_1 = require("typeorm");
var OtpType;
(function (OtpType) {
    OtpType["LOGIN"] = "login";
    OtpType["REGISTRATION"] = "registration";
    OtpType["FORGOT_PASSWORD"] = "forgot_password";
    OtpType["VERIFY_EMAIL"] = "verify_email";
    OtpType["VERIFY_PHONE"] = "verify_phone";
    OtpType["TWO_FACTOR_AUTH"] = "two_factor_auth";
    OtpType["RESET_PASSWORD"] = "reset_password";
    OtpType["CHANGE_EMAIL"] = "change_email";
    OtpType["CHANGE_PHONE"] = "change_phone";
    OtpType["CUSTOM"] = "custom";
})(OtpType || (exports.OtpType = OtpType = {}));
let Otp = class Otp {
};
exports.Otp = Otp;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("increment"),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], Otp.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 4 }),
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Otp.prototype, "otp", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "string" }),
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Otp.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)("enum", { enum: OtpType, default: OtpType.REGISTRATION }),
    (0, swagger_1.ApiProperty)({ enum: OtpType, default: OtpType.REGISTRATION }),
    __metadata("design:type", String)
], Otp.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", default: 0 }),
    (0, swagger_1.ApiProperty)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], Otp.prototype, "attempts", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: "user_id" }),
    (0, swagger_1.ApiProperty)({ type: () => user_entity_1.User }),
    __metadata("design:type", user_entity_1.User)
], Otp.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp" }),
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], Otp.prototype, "expiresAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], Otp.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], Otp.prototype, "updatedAt", void 0);
exports.Otp = Otp = __decorate([
    (0, typeorm_1.Entity)({ name: "otps" })
], Otp);
//# sourceMappingURL=otp.entity.js.map