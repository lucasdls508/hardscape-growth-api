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
exports.EstimateCatalogs = void 0;
const catalogs_entity_1 = require("../../../catalogs/enitities/catalogs.entity");
const estimates_entity_1 = require("../../entities/estimates.entity");
const typeorm_1 = require("typeorm");
let EstimateCatalogs = class EstimateCatalogs {
};
exports.EstimateCatalogs = EstimateCatalogs;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], EstimateCatalogs.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", name: "estimate_id" }),
    __metadata("design:type", Number)
], EstimateCatalogs.prototype, "estimate_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => estimates_entity_1.Estimates, (estimate) => estimate.estimate_catalogs),
    (0, typeorm_1.JoinColumn)({ name: "estimate_id" }),
    __metadata("design:type", estimates_entity_1.Estimates)
], EstimateCatalogs.prototype, "estimate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", name: "catalog_id" }),
    __metadata("design:type", Number)
], EstimateCatalogs.prototype, "catalog_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => catalogs_entity_1.Catalogs, (catalogs) => catalogs.estimate_catalogs),
    (0, typeorm_1.JoinColumn)({ name: "catalog_id" }),
    __metadata("design:type", catalogs_entity_1.Catalogs)
], EstimateCatalogs.prototype, "catalog", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", name: "quantity", precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], EstimateCatalogs.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "unit_cost",
        type: "decimal",
        precision: 10,
        scale: 2,
    }),
    __metadata("design:type", Number)
], EstimateCatalogs.prototype, "unit_cost", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "unit_price",
        type: "decimal",
        precision: 10,
        scale: 2,
    }),
    __metadata("design:type", Number)
], EstimateCatalogs.prototype, "unit_price", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], EstimateCatalogs.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], EstimateCatalogs.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)(),
    __metadata("design:type", Date)
], EstimateCatalogs.prototype, "deletedAt", void 0);
exports.EstimateCatalogs = EstimateCatalogs = __decorate([
    (0, typeorm_1.Entity)("estimate_catalogs")
], EstimateCatalogs);
//# sourceMappingURL=estimate_catalogs.entity.js.map