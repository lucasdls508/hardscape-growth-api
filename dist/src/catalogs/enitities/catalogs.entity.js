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
exports.Catalogs = void 0;
const estimate_catalogs_entity_1 = require("../../estimates/estimates_catalogs/entities/estimate_catalogs.entity");
const typeorm_1 = require("typeorm");
let Catalogs = class Catalogs {
};
exports.Catalogs = Catalogs;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Catalogs.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "name", type: "varchar", length: 100 }),
    __metadata("design:type", String)
], Catalogs.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "desc", type: "varchar", length: 500 }),
    __metadata("design:type", String)
], Catalogs.prototype, "desc", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "unit", type: "decimal" }),
    __metadata("design:type", Number)
], Catalogs.prototype, "unit", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "material_unit_cost",
        type: "decimal",
        precision: 10,
        scale: 2,
    }),
    __metadata("design:type", Number)
], Catalogs.prototype, "material_unit_cost", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "material_unit_price",
        type: "decimal",
        precision: 10,
        scale: 2,
    }),
    __metadata("design:type", Number)
], Catalogs.prototype, "material_unit_price", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => estimate_catalogs_entity_1.EstimateCatalogs, (ec) => ec.catalog),
    __metadata("design:type", Array)
], Catalogs.prototype, "estimate_catalogs", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Catalogs.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Catalogs.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)(),
    __metadata("design:type", Date)
], Catalogs.prototype, "deletedAt", void 0);
exports.Catalogs = Catalogs = __decorate([
    (0, typeorm_1.Entity)("catalogs")
], Catalogs);
//# sourceMappingURL=catalogs.entity.js.map