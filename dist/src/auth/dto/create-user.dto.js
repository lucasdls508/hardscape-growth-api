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
exports.CreateAdminDto = exports.CreateUserDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const not_admin_decorator_1 = require("../../shared/decorators/not-admin.decorator");
class CreateUserDto {
}
exports.CreateUserDto = CreateUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: true, description: "First Name of user" }),
    (0, not_admin_decorator_1.IsNotAdmin)(),
    (0, class_validator_1.MaxLength)(20, { message: "First Name exceeds given length" }),
    (0, class_validator_1.MinLength)(1, { message: "First name has to be of length 1" }),
    (0, class_validator_1.IsString)({ message: "First name must be a string" }),
    (0, class_validator_1.IsNotEmpty)({ message: "First name can not be empty" }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "first_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: true, description: "Last Name of user" }),
    (0, not_admin_decorator_1.IsNotAdmin)(),
    (0, class_validator_1.MaxLength)(20, { message: "Last Name exceeds given length" }),
    (0, class_validator_1.MinLength)(1, { message: "Last name has to be of length 1" }),
    (0, class_validator_1.IsString)({ message: "Last name must be a string" }),
    (0, class_validator_1.IsNotEmpty)({ message: "Last name can not be empty" }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "last_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: true, description: "Email of user" }),
    (0, class_validator_1.IsEmail)({}, { message: "Invalid Email" }),
    (0, class_validator_1.IsString)({ message: "Email can not be only numbers" }),
    (0, class_validator_1.IsNotEmpty)({ message: "email can not be empty" }),
    (0, class_transformer_1.Transform)(({ value }) => value.trim().toLowerCase()),
    __metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: true, description: "Phone of user" }),
    (0, class_validator_1.IsNumberString)(),
    (0, class_validator_1.MinLength)(9),
    (0, class_validator_1.MaxLength)(18),
    (0, class_validator_1.IsNotEmpty)({ message: "phone can not be empty" }),
    (0, class_transformer_1.Transform)(({ value }) => value.trim().toLowerCase()),
    __metadata("design:type", String)
], CreateUserDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: true, description: "Password user wants provide" }),
    (0, class_validator_1.IsNotEmpty)({ message: "Password can not be empty" }),
    (0, class_validator_1.MinLength)(8, { message: "Password must contain minimum of 8 characters" }),
    (0, class_validator_1.MaxLength)(32, { message: "Password must contain maximum of 32 characters" }),
    (0, class_validator_1.Matches)(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: "Weak Password",
    }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "password", void 0);
class CreateAdminDto extends CreateUserDto {
}
exports.CreateAdminDto = CreateAdminDto;
__decorate([
    (0, class_validator_1.IsNumberString)(),
    (0, class_validator_1.MinLength)(9),
    (0, class_validator_1.MaxLength)(18),
    (0, class_validator_1.IsNotEmpty)({ message: "Role Should be admin" }),
    __metadata("design:type", Array)
], CreateAdminDto.prototype, "roles", void 0);
//# sourceMappingURL=create-user.dto.js.map