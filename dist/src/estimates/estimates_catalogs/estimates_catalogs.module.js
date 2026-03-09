"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EstimatesCatalogsModule = void 0;
const common_1 = require("@nestjs/common");
const estimates_catalogs_controller_1 = require("./estimates_catalogs.controller");
const estimates_catalogs_service_1 = require("./estimates_catalogs.service");
let EstimatesCatalogsModule = class EstimatesCatalogsModule {
};
exports.EstimatesCatalogsModule = EstimatesCatalogsModule;
exports.EstimatesCatalogsModule = EstimatesCatalogsModule = __decorate([
    (0, common_1.Module)({
        controllers: [estimates_catalogs_controller_1.EstimatesCatalogsController],
        providers: [estimates_catalogs_service_1.EstimatesCatalogsService]
    })
], EstimatesCatalogsModule);
//# sourceMappingURL=estimates_catalogs.module.js.map