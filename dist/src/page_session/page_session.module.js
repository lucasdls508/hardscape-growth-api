"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageSessionModule = void 0;
const axios_1 = require("@nestjs/axios");
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const agency_profiles_module_1 = require("../agency_profiles/agency_profiles.module");
const auth_module_1 = require("../auth/auth.module");
const user_module_1 = require("../user/user.module");
const meta_buisness_entity_1 = require("./entites/meta_buisness.entity");
const page_session_controller_1 = require("./page_session.controller");
const page_session_service_1 = require("./page_session.service");
let PageSessionModule = class PageSessionModule {
};
exports.PageSessionModule = PageSessionModule;
exports.PageSessionModule = PageSessionModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([meta_buisness_entity_1.MetaBuisnessProfiles]),
            axios_1.HttpModule,
            auth_module_1.AuthModule,
            agency_profiles_module_1.AgencyProfilesModule,
            user_module_1.UserModule,
            bull_1.BullModule.registerQueue({ name: "global" }),
        ],
        providers: [page_session_service_1.PageSessionService],
        controllers: [page_session_controller_1.PageSessionController],
        exports: [page_session_service_1.PageSessionService],
    })
], PageSessionModule);
//# sourceMappingURL=page_session.module.js.map