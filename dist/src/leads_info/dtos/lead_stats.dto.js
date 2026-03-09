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
exports.LeadStatsQueryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class LeadStatsQueryDto {
}
exports.LeadStatsQueryDto = LeadStatsQueryDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: ["last_week", "last_month", "this_month", "this_year", "previous_year", "month"],
    }),
    (0, class_validator_1.IsEnum)(["last_week", "last_month", "this_month", "this_year", "previous_year", "month"]),
    __metadata("design:type", String)
], LeadStatsQueryDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "January" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LeadStatsQueryDto.prototype, "monthName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ["agency", "contractor"], default: "agency" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(["agency", "contractor"]),
    __metadata("design:type", String)
], LeadStatsQueryDto.prototype, "role", void 0);
//# sourceMappingURL=lead_stats.dto.js.map