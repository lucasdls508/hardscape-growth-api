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
exports.WithDrawDto = exports.RechargeDto = void 0;
const class_validator_1 = require("class-validator");
class RechargeDto {
}
exports.RechargeDto = RechargeDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(10, { message: "Minimum 10 Pounds required" }),
    (0, class_validator_1.Max)(10000, { message: "Maximum 10000 recharge possible" }),
    __metadata("design:type", Number)
], RechargeDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RechargeDto.prototype, "paymentId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RechargeDto.prototype, "paymentMethod", void 0);
class WithDrawDto {
}
exports.WithDrawDto = WithDrawDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(30, { message: "Minimum 10 Pounds required to withdraw" }),
    (0, class_validator_1.Max)(10000, { message: "Maximum 10000 withdraw possible" }),
    __metadata("design:type", Number)
], WithDrawDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], WithDrawDto.prototype, "paymentMethod", void 0);
//# sourceMappingURL=recharge.dto.js.map