"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadsInfoModule = void 0;
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const appointments_module_1 = require("../appointments/appointments.module");
const auth_module_1 = require("../auth/auth.module");
const lead_seed_service_1 = require("./lead_seed/lead_seed.service");
const user_module_1 = require("../user/user.module");
const lead_entity_1 = require("./entities/lead.entity");
const leads_info_controller_1 = require("./leads_info.controller");
const leads_info_service_1 = require("./leads_info.service");
const leads_query_service_1 = require("./leads_query/leads_query.service");
const leads_stats_service_1 = require("./leads_stats/leads_stats.service");
let LeadsInfoModule = class LeadsInfoModule {
};
exports.LeadsInfoModule = LeadsInfoModule;
exports.LeadsInfoModule = LeadsInfoModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([lead_entity_1.Lead]),
            auth_module_1.AuthModule,
            user_module_1.UserModule,
            bull_1.BullModule.registerQueue({ name: "leads" }),
            appointments_module_1.AppointmentsModule,
        ],
        controllers: [leads_info_controller_1.LeadsController],
        providers: [leads_info_service_1.LeadsInfoService, leads_stats_service_1.LeadsStatsService, leads_query_service_1.LeadsQueryService, lead_seed_service_1.LeadSeedService],
        exports: [leads_info_service_1.LeadsInfoService],
    })
], LeadsInfoModule);
//# sourceMappingURL=leads_info.module.js.map