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
exports.CreateUserAddressDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateUserAddressDto {
}
exports.CreateUserAddressDto = CreateUserAddressDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "221B Baker Street" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserAddressDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "221B" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserAddressDto.prototype, "house_number", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Apartment 4A", required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserAddressDto.prototype, "address_2", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "London" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserAddressDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "GB" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(5, { message: "Country should contains only iso code " }),
    (0, class_validator_1.MinLength)(2, { message: "Country should contains only iso code " }),
    __metadata("design:type", String)
], CreateUserAddressDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "NW1 6XE" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserAddressDto.prototype, "postal_code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "England", required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserAddressDto.prototype, "country_state", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 51.523767, description: "Latitude coordinate", required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: "Latitude must be a valid number" }),
    __metadata("design:type", Number)
], CreateUserAddressDto.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: -0.1585557, description: "Longitude coordinate", required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: "Longitude must be a valid number" }),
    __metadata("design:type", Number)
], CreateUserAddressDto.prototype, "longitude", void 0);
//# sourceMappingURL=create-user-address.dto.js.map