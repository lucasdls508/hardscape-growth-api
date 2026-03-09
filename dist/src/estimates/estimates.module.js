"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EstimatesModule = void 0;
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const leadsQueue_1 = require("../bull/processors/leadsQueue");
const catalogs_entity_1 = require("../catalogs/enitities/catalogs.entity");
const s3_module_1 = require("../s3/s3.module");
const estimates_entity_1 = require("./entities/estimates.entity");
const estimate_renderer_service_1 = require("./estimate-renderer.service");
const estimates_controller_1 = require("./estimates.controller");
const estimates_service_1 = require("./estimates.service");
const estimate_catalogs_entity_1 = require("./estimates_catalogs/entities/estimate_catalogs.entity");
const estimates_catalogs_module_1 = require("./estimates_catalogs/estimates_catalogs.module");
let EstimatesModule = class EstimatesModule {
};
exports.EstimatesModule = EstimatesModule;
exports.EstimatesModule = EstimatesModule = __decorate([
    (0, common_1.Module)({
        controllers: [estimates_controller_1.EstimatesController],
        providers: [estimates_service_1.EstimatesService, estimate_renderer_service_1.EstimateRendererService],
        exports: [estimates_service_1.EstimatesService],
        imports: [
            typeorm_1.TypeOrmModule.forFeature([estimates_entity_1.Estimates, estimate_catalogs_entity_1.EstimateCatalogs, catalogs_entity_1.Catalogs]),
            estimates_catalogs_module_1.EstimatesCatalogsModule,
            bull_1.BullModule.registerQueue({
                name: leadsQueue_1.LEAD_QUEUE_JOB,
            }),
            s3_module_1.S3Module,
        ],
    })
], EstimatesModule);
//# sourceMappingURL=estimates.module.js.map