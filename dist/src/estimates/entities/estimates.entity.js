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
exports.Estimates = exports.EstimateStatus = void 0;
const swagger_1 = require("@nestjs/swagger");
const lead_entity_1 = require("../../leads_info/entities/lead.entity");
const user_entity_1 = require("../../user/entities/user.entity");
const typeorm_1 = require("typeorm");
const estimate_catalogs_entity_1 = require("../estimates_catalogs/entities/estimate_catalogs.entity");
var EstimateStatus;
(function (EstimateStatus) {
    EstimateStatus["UN_SIGNED"] = "unsigned";
    EstimateStatus["CANCELED"] = "canceled";
    EstimateStatus["CONFIRMED"] = "confirmed";
    EstimateStatus["DEPOSIT_PAID"] = "deposit_paid";
})(EstimateStatus || (exports.EstimateStatus = EstimateStatus = {}));
let Estimates = class Estimates {
};
exports.Estimates = Estimates;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Estimates.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "estimate_no", type: "int" }),
    __metadata("design:type", Number)
], Estimates.prototype, "estimate_no", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "prepared_for", type: "uuid" }),
    __metadata("design:type", String)
], Estimates.prototype, "prepared_for", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "prepared_by", type: "uuid" }),
    __metadata("design:type", String)
], Estimates.prototype, "prepared_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => lead_entity_1.Lead, (lead) => lead.estimates),
    (0, typeorm_1.JoinColumn)({ name: "prepared_for" }),
    __metadata("design:type", lead_entity_1.Lead)
], Estimates.prototype, "lead", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.estimates),
    (0, typeorm_1.JoinColumn)({ name: "prepared_by" }),
    __metadata("design:type", user_entity_1.User)
], Estimates.prototype, "prepared_by_user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => estimate_catalogs_entity_1.EstimateCatalogs, (estimate_catalogs) => estimate_catalogs.estimate),
    __metadata("design:type", Array)
], Estimates.prototype, "estimate_catalogs", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "terms_and_conditions", type: "varchar" }),
    __metadata("design:type", String)
], Estimates.prototype, "terms_and_conditions", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
    __metadata("design:type", String)
], Estimates.prototype, "contructor_signature", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
    __metadata("design:type", String)
], Estimates.prototype, "lead_signature", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", default: EstimateStatus.UN_SIGNED }),
    __metadata("design:type", String)
], Estimates.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
    __metadata("design:type", String)
], Estimates.prototype, "stripe_session_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
    __metadata("design:type", String)
], Estimates.prototype, "stripe_payment_url", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], Estimates.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], Estimates.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], Estimates.prototype, "deletedAt", void 0);
exports.Estimates = Estimates = __decorate([
    (0, typeorm_1.Entity)("estimates")
], Estimates);
//# sourceMappingURL=estimates.entity.js.map