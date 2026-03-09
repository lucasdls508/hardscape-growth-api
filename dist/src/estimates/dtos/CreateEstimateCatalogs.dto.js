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
exports.CreateEstimateCatalogItemDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateEstimateCatalogItemDto {
}
exports.CreateEstimateCatalogItemDto = CreateEstimateCatalogItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: "Catalog ID" }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateEstimateCatalogItemDto.prototype, "catalog_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10, description: "Quantity of this item" }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateEstimateCatalogItemDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5.0, description: "Optional override unit cost", required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateEstimateCatalogItemDto.prototype, "unit_cost", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10.0, description: "Optional override unit price", required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateEstimateCatalogItemDto.prototype, "unit_price", void 0);
//# sourceMappingURL=CreateEstimateCatalogs.dto.js.map