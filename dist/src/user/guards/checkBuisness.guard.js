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
exports.CheckBuisnessGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
let CheckBuisnessGuard = class CheckBuisnessGuard {
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const { user, userInfo } = context.switchToHttp().getRequest();
        if (userInfo.agency_profiles.length <= 0) {
            throw new common_1.ForbiddenException("Your Agency is not setup yet! Please Fill the required information.");
        }
        const connected_agency = userInfo.agency_profiles[0];
        const requiredFields = [
            { key: "nid_front", message: "Nid Front image is not attached with your account!" },
            { key: "nid_back", message: "Nid Back image is not attached with your account!" },
            { key: "tax_id_front", message: "Tax Front image is not attached with your account!" },
            { key: "tax_id_back", message: "Tax Back image is not attached with your account!" },
        ];
        for (const field of requiredFields) {
            if (!connected_agency?.[field.key]) {
                console.log("Value");
                throw new common_1.ForbiddenException(field.message);
            }
        }
        if (!userInfo.buisness_profiles) {
            throw new common_1.ForbiddenException("Your Buisness profile is not setup yet ! Wait until admin attach your buisness .");
        }
        return true;
    }
};
exports.CheckBuisnessGuard = CheckBuisnessGuard;
exports.CheckBuisnessGuard = CheckBuisnessGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], CheckBuisnessGuard);
//# sourceMappingURL=checkBuisness.guard.js.map