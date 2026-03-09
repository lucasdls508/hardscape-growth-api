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
exports.EstimatesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const get_user_decorator_1 = require("../auth/decorators/get-user.decorator");
const session_auth_guard_1 = require("../auth/guards/session-auth.guard");
const roles_decorator_1 = require("../user/decorators/roles.decorator");
const user_entity_1 = require("../user/entities/user.entity");
const role_enum_1 = require("../user/enums/role.enum");
const roles_guard_1 = require("../user/guards/roles.guard");
const CreateEstimate_dto_1 = require("./dtos/CreateEstimate.dto");
const EstimateStatusUpdate_dto_1 = require("./dtos/EstimateStatusUpdate.dto");
const signEstimate_dto_1 = require("./dtos/signEstimate.dto");
const UpdateLeadSignature_dto_1 = require("./dtos/UpdateLeadSignature.dto");
const estimates_entity_1 = require("./entities/estimates.entity");
const estimates_service_1 = require("./estimates.service");
let EstimatesController = class EstimatesController {
    constructor(estimatesService) {
        this.estimatesService = estimatesService;
    }
    async create(user, body) {
        return this.estimatesService.create({ ...body, prepared_by: user.id });
    }
    async findByUser(user, page = "1", limit = "10", status, searchTerm) {
        return this.estimatesService.findByUser(user.id, Number(page), Number(limit), status, searchTerm);
    }
    async updateEstimateStatus(id, dto) {
        return this.estimatesService.updateEstimateStatus(id, dto);
    }
    async getEstimatesByLead(leadId) {
        return this.estimatesService.getEstimatesByLead(leadId);
    }
    async getEstimateStatistics(user) {
        return this.estimatesService.getCombinedEstimateStatistics(user.id);
    }
    async findOne(id) {
        return this.estimatesService.findOne(id);
    }
    async renderSignPage(id, reply) {
        const html = await this.estimatesService.renderSignPage(id);
        return reply.status(200).header("Content-Type", "text/html; charset=utf-8").send(html);
    }
    sign(id, dto) {
        return this.estimatesService.sign(id, dto.lead_signature);
    }
    async updateLeadSignature(id, body) {
        return this.estimatesService.updateLeadSignature(id, body.lead_signature);
    }
};
exports.EstimatesController = EstimatesController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(session_auth_guard_1.JwtAuthenticationGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.UserRoles.CONTRUCTOR, role_enum_1.UserRoles.AGENCY_OWNER),
    (0, swagger_1.ApiOperation)({ summary: "Create a new estimate with catalog items" }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "Estimate created", type: estimates_entity_1.Estimates }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, CreateEstimate_dto_1.CreateEstimateDto]),
    __metadata("design:returntype", Promise)
], EstimatesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(""),
    (0, common_1.UseGuards)(session_auth_guard_1.JwtAuthenticationGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.UserRoles.CONTRUCTOR, role_enum_1.UserRoles.AGENCY_OWNER),
    (0, swagger_1.ApiOperation)({ summary: "Get all estimates by user (paginated)" }),
    (0, swagger_1.ApiQuery)({ name: "page", required: false, type: Number, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: "limit", required: false, type: Number, example: 10 }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Query)("page")),
    __param(2, (0, common_1.Query)("limit")),
    __param(3, (0, common_1.Query)("status")),
    __param(4, (0, common_1.Query)("search")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, Object, Object, String, String]),
    __metadata("design:returntype", Promise)
], EstimatesController.prototype, "findByUser", null);
__decorate([
    (0, common_1.Patch)(":id/status"),
    (0, swagger_1.ApiOperation)({ summary: "Update status of an estimate" }),
    (0, swagger_1.ApiOkResponse)({ type: estimates_entity_1.Estimates, description: "Estimate status updated successfully" }),
    (0, swagger_1.ApiBadRequestResponse)({ description: "Invalid status value" }),
    (0, swagger_1.ApiNotFoundResponse)({ description: "Estimate not found" }),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, EstimateStatusUpdate_dto_1.UpdateEstimateStatusDto]),
    __metadata("design:returntype", Promise)
], EstimatesController.prototype, "updateEstimateStatus", null);
__decorate([
    (0, common_1.Get)("lead/:leadId"),
    (0, common_1.UseGuards)(session_auth_guard_1.JwtAuthenticationGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.UserRoles.CONTRUCTOR, role_enum_1.UserRoles.AGENCY_OWNER),
    (0, swagger_1.ApiOperation)({ summary: "Get all estimates for a lead" }),
    __param(0, (0, common_1.Param)("leadId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EstimatesController.prototype, "getEstimatesByLead", null);
__decorate([
    (0, common_1.Get)("statistics"),
    (0, common_1.UseGuards)(session_auth_guard_1.JwtAuthenticationGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.UserRoles.CONTRUCTOR, role_enum_1.UserRoles.AGENCY_OWNER),
    (0, swagger_1.ApiOperation)({ summary: "Get estimate statistics grouped by lead status" }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], EstimatesController.prototype, "getEstimateStatistics", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, common_1.UseGuards)(session_auth_guard_1.JwtAuthenticationGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.UserRoles.CONTRUCTOR, role_enum_1.UserRoles.AGENCY_OWNER),
    (0, swagger_1.ApiOperation)({ summary: "Get a single estimate by ID" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Estimate found", type: estimates_entity_1.Estimates }),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], EstimatesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(":id/sign"),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], EstimatesController.prototype, "renderSignPage", null);
__decorate([
    (0, common_1.Post)(":id/sign"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, signEstimate_dto_1.SignEstimateDto]),
    __metadata("design:returntype", void 0)
], EstimatesController.prototype, "sign", null);
__decorate([
    (0, common_1.Patch)(":id/lead-signature"),
    (0, common_1.UseGuards)(session_auth_guard_1.JwtAuthenticationGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.UserRoles.CONTRUCTOR, role_enum_1.UserRoles.AGENCY_OWNER),
    (0, swagger_1.ApiOperation)({ summary: "Update lead signature for an estimate" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Lead signature updated", type: estimates_entity_1.Estimates }),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, UpdateLeadSignature_dto_1.UpdateLeadSignatureDto]),
    __metadata("design:returntype", Promise)
], EstimatesController.prototype, "updateLeadSignature", null);
exports.EstimatesController = EstimatesController = __decorate([
    (0, swagger_1.ApiTags)("Estimates"),
    (0, common_1.Controller)("estimates"),
    __metadata("design:paramtypes", [estimates_service_1.EstimatesService])
], EstimatesController);
//# sourceMappingURL=estimates.controller.js.map