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
exports.UpdateProfilePictureDto = exports.UpdateUserDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const not_admin_decorator_1 = require("../../shared/decorators/not-admin.decorator");
class UpdateUserDto {
}
exports.UpdateUserDto = UpdateUserDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ required: false, description: "First Name of user" }),
    (0, not_admin_decorator_1.IsNotAdmin)(),
    (0, class_validator_1.MaxLength)(20, { message: "First Name exceeds given length" }),
    (0, class_validator_1.MinLength)(1, { message: "First name has to be of length 1" }),
    (0, class_validator_1.IsAlpha)(),
    (0, class_validator_1.IsString)({ message: "First name must be a string" }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "first_name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ required: false, description: "Last Name of user" }),
    (0, not_admin_decorator_1.IsNotAdmin)(),
    (0, class_validator_1.MaxLength)(20, { message: "Last Name exceeds given length" }),
    (0, class_validator_1.MinLength)(1, { message: "Last name has to be of length 1" }),
    (0, class_validator_1.IsAlpha)(),
    (0, class_validator_1.IsString)({ message: "Last name must be a string" }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "last_name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ required: false, description: "Email of user" }),
    (0, not_admin_decorator_1.IsNotAdmin)(),
    (0, class_validator_1.MaxLength)(200, { message: "Email exceeds given length" }),
    (0, class_validator_1.MinLength)(1, { message: "Email has to be of length 1" }),
    (0, class_validator_1.IsString)({ message: "Email must be a string" }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ required: false, description: "Image url of user" }),
    (0, not_admin_decorator_1.IsNotAdmin)(),
    (0, class_validator_1.MaxLength)(200, { message: "Image url must be 200" }),
    (0, class_validator_1.MinLength)(1, { message: "Image URl must be 1" }),
    (0, class_validator_1.IsAlpha)(),
    (0, class_validator_1.IsString)({ message: "Last name must be a string" }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "image", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "fcm", void 0);
class UpdateProfilePictureDto {
}
exports.UpdateProfilePictureDto = UpdateProfilePictureDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ required: true, description: "Image url is requied" }),
    (0, class_validator_1.IsString)({ message: "Image url must be string" }),
    __metadata("design:type", String)
], UpdateProfilePictureDto.prototype, "image", void 0);
//# sourceMappingURL=update-user.dto.js.map