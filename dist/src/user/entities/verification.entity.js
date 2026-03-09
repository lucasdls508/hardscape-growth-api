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
exports.Verification = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
let Verification = class Verification {
};
exports.Verification = Verification;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    (0, swagger_1.ApiProperty)({ description: "Unique identifier for the verification" }),
    __metadata("design:type", Number)
], Verification.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, swagger_1.ApiProperty)({ description: "User ID associated with the verification" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Verification.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    (0, swagger_1.ApiProperty)({ description: "Indicates if the email is verified", default: false }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], Verification.prototype, "is_email_verified", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: "user_id" }),
    (0, swagger_1.ApiProperty)({ type: () => user_entity_1.User }),
    __metadata("design:type", user_entity_1.User)
], Verification.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    (0, swagger_1.ApiProperty)({ description: "Indicates if the admin is verified", default: false }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], Verification.prototype, "is_admin_verified", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    (0, swagger_1.ApiProperty)({ description: "Indicates if the users is suspended", default: false }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], Verification.prototype, "is_suspended", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    (0, swagger_1.ApiProperty)({ description: "Indicates if the record is deleted", default: false }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], Verification.prototype, "is_deleted", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: "active" }),
    (0, swagger_1.ApiProperty)({ description: "Status of the verification", default: "active" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Verification.prototype, "status", void 0);
exports.Verification = Verification = __decorate([
    (0, typeorm_1.Entity)("verifications")
], Verification);
//# sourceMappingURL=verification.entity.js.map