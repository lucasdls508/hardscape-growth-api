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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgencyProfilesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const get_user_decorator_1 = require("../auth/decorators/get-user.decorator");
const session_auth_guard_1 = require("../auth/guards/session-auth.guard");
const roles_decorator_1 = require("../user/decorators/roles.decorator");
const user_entity_1 = require("../user/entities/user.entity");
const role_enum_1 = require("../user/enums/role.enum");
const roles_guard_1 = require("../user/guards/roles.guard");
const agency_profiles_service_1 = require("./agency_profiles.service");
const update_agency_dto_1 = require("./dtos/update_agency.dto");
const agency_profiles_entity_1 = require("./entities/agency_profiles.entity");
let AgencyProfilesController = class AgencyProfilesController {
    constructor(_agencyProfileService) {
        this._agencyProfileService = _agencyProfileService;
    }
    async updateMyAgencyProfile(req, dto, user) {
        return this._agencyProfileService.updateMyAgencyProfile(user, dto);
    }
    async getAgencyMembers(user, query) {
        const { page = 1, limit = 10 } = query;
        console.log(user, page, limit);
        return this._agencyProfileService.getAgencyMembers(user.id, page, limit);
    }
    async updateMyAgency(user, dto) {
        return this._agencyProfileService.updateMyAgencyProfileInfo(user, dto);
    }
};
exports.AgencyProfilesController = AgencyProfilesController;
__decorate([
    (0, common_1.Patch)("me"),
    (0, common_1.UseGuards)(session_auth_guard_1.JwtAuthenticationGuard),
    (0, swagger_1.ApiOperation)({ summary: "Update my agency profile" }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_agency_dto_1.UpdateAgencyProfileDto, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], AgencyProfilesController.prototype, "updateMyAgencyProfile", null);
__decorate([
    (0, common_1.Get)("members"),
    (0, swagger_1.ApiOperation)({
        summary: "Get agency members",
        description: "Returns paginated users working under the authenticated agency owner",
    }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, Object]),
    __metadata("design:returntype", Promise)
], AgencyProfilesController.prototype, "getAgencyMembers", null);
__decorate([
    (0, common_1.Patch)("update-my-profile"),
    (0, common_1.UseGuards)(session_auth_guard_1.JwtAuthenticationGuard),
    (0, swagger_1.ApiOperation)({
        summary: "Update my agency profile",
        description: "Allows agency owner to update agency profile information",
    }),
    (0, swagger_1.ApiOkResponse)({
        description: "Agency profile updated successfully",
        type: agency_profiles_entity_1.AgencyProfile,
    }),
    __param(0, (0, get_user_decorator_1.GetUserInformation)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, update_agency_dto_1.UpdateAgencyProfileDto]),
    __metadata("design:returntype", Promise)
], AgencyProfilesController.prototype, "updateMyAgency", null);
exports.AgencyProfilesController = AgencyProfilesController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(session_auth_guard_1.JwtAuthenticationGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.UserRoles.AGENCY_OWNER),
    (0, common_1.Controller)("agency-profiles"),
    __metadata("design:paramtypes", [agency_profiles_service_1.AgencyProfilesService])
], AgencyProfilesController);
//# sourceMappingURL=agency_profiles.controller.js.map