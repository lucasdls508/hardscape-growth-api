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
exports.PageSessionController = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_decorator_1 = require("../user/decorators/roles.decorator");
const role_enum_1 = require("../user/enums/role.enum");
const update_meta_buisness_profile_dto_1 = require("./dto/update_meta_buisness_profile.dto");
const meta_buisness_entity_1 = require("./entites/meta_buisness.entity");
const page_session_service_1 = require("./page_session.service");
let PageSessionController = class PageSessionController {
    constructor(_metaBusinessProfilesService) {
        this._metaBusinessProfilesService = _metaBusinessProfilesService;
    }
    findByPage(page_id, user_id) {
        return this._metaBusinessProfilesService.connectFacebookPage({ page_id, user_id });
    }
    retriveAll() {
        return this._metaBusinessProfilesService.syncWithMeta();
    }
    findByPageId(pageId) {
        return this._metaBusinessProfilesService.findByPageId(pageId);
    }
    update(id, updateProfileDto) {
        return this._metaBusinessProfilesService.update(id, updateProfileDto);
    }
    remove(id) {
        return this._metaBusinessProfilesService.remove(id);
    }
};
exports.PageSessionController = PageSessionController;
__decorate([
    (0, common_2.Post)(":page_id"),
    (0, swagger_1.ApiOperation)({ summary: "Get a profile by Meta page ID" }),
    (0, swagger_1.ApiParam)({
        name: "page_id",
        description: "The Meta page ID",
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Profile found",
        type: meta_buisness_entity_1.MetaBuisnessProfiles,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: "Profile not found",
    }),
    (0, common_2.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.UserRoles.ADMIN),
    __param(0, (0, common_2.Param)("page_id")),
    __param(1, (0, common_1.Query)("user_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PageSessionController.prototype, "findByPage", null);
__decorate([
    (0, common_2.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "Get all Meta business profiles" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "List of all profiles",
        type: [meta_buisness_entity_1.MetaBuisnessProfiles],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PageSessionController.prototype, "retriveAll", null);
__decorate([
    (0, common_2.Get)("by-page/:pageId"),
    (0, swagger_1.ApiOperation)({ summary: "Get a profile by Meta page ID" }),
    (0, swagger_1.ApiParam)({
        name: "pageId",
        description: "The Meta page ID",
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Profile found",
        type: meta_buisness_entity_1.MetaBuisnessProfiles,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: "Profile not found",
    }),
    __param(0, (0, common_2.Param)("pageId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PageSessionController.prototype, "findByPageId", null);
__decorate([
    (0, common_2.Patch)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Update a Meta business profile" }),
    (0, swagger_1.ApiParam)({
        name: "id",
        description: "The profile ID",
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Profile updated successfully",
        type: meta_buisness_entity_1.MetaBuisnessProfiles,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: "Profile not found",
    }),
    __param(0, (0, common_2.Param)("id", common_2.ParseIntPipe)),
    __param(1, (0, common_2.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_meta_buisness_profile_dto_1.UpdateMetaBusinessProfileDto]),
    __metadata("design:returntype", Promise)
], PageSessionController.prototype, "update", null);
__decorate([
    (0, common_2.Delete)(":id"),
    (0, common_2.HttpCode)(common_2.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: "Delete a Meta business profile" }),
    (0, swagger_1.ApiParam)({
        name: "id",
        description: "The profile ID",
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Profile deleted successfully",
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: "Profile not found",
    }),
    __param(0, (0, common_2.Param)("id", common_2.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PageSessionController.prototype, "remove", null);
exports.PageSessionController = PageSessionController = __decorate([
    (0, swagger_1.ApiTags)("Meta Business Profiles"),
    (0, common_2.Controller)("meta-business-profiles"),
    __metadata("design:paramtypes", [page_session_service_1.PageSessionService])
], PageSessionController);
//# sourceMappingURL=page_session.controller.js.map