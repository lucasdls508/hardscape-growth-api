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
exports.UpdateMetaBusinessProfileDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const create_meta_buisness_profile_dto_1 = require("./create_meta_buisness_profile.dto");
class UpdateMetaBusinessProfileDto extends (0, mapped_types_1.PartialType)(create_meta_buisness_profile_dto_1.CreateMetaBusinessProfileDto) {
}
exports.UpdateMetaBusinessProfileDto = UpdateMetaBusinessProfileDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "123456789",
        description: "Meta page ID",
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateMetaBusinessProfileDto.prototype, "page_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "user-123",
        description: "User ID",
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateMetaBusinessProfileDto.prototype, "user_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "Updated Business Name",
        description: "Business name",
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateMetaBusinessProfileDto.prototype, "buisness_name", void 0);
//# sourceMappingURL=update_meta_buisness_profile.dto.js.map