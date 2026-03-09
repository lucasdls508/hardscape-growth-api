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
exports.LeadsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const get_user_decorator_1 = require("../auth/decorators/get-user.decorator");
const session_auth_guard_1 = require("../auth/guards/session-auth.guard");
const lead_seed_service_1 = require("./lead_seed/lead_seed.service");
const roles_decorator_1 = require("../user/decorators/roles.decorator");
const user_entity_1 = require("../user/entities/user.entity");
const role_enum_1 = require("../user/enums/role.enum");
const checkBuisness_guard_1 = require("../user/guards/checkBuisness.guard");
const roles_guard_1 = require("../user/guards/roles.guard");
const assign_contructor_dto_1 = require("./dtos/assign_contructor.dto");
const lead_stats_dto_1 = require("./dtos/lead_stats.dto");
const leads_query_dto_1 = require("./dtos/leads_query.dto");
const LeadStatus_dto_1 = require("./dtos/LeadStatus.dto");
const lead_entity_1 = require("./entities/lead.entity");
const leads_info_service_1 = require("./leads_info.service");
const leads_query_service_1 = require("./leads_query/leads_query.service");
const leads_stats_service_1 = require("./leads_stats/leads_stats.service");
let LeadsController = class LeadsController {
    constructor(leadsQueryService, leadsStatsService, leadsService, leadSeedService) {
        this.leadsQueryService = leadsQueryService;
        this.leadsStatsService = leadsStatsService;
        this.leadsService = leadsService;
        this.leadSeedService = leadSeedService;
    }
    async getUserLeads(user, query, userInfo) {
        return this.leadsQueryService.getUserLeads({
            userId: user.id,
            role: userInfo.roles,
            page: Number(query.page || 1),
            limit: Number(query.limit || 10),
            status: query.status,
            is_used: query.is_used,
        });
    }
    async GetLeadById(userInfo, id) {
        return this.leadsService.getLeadById(id, userInfo);
    }
    async updateLead(user, id, updateLeadDto) {
        return this.leadsService.updateLead(id, user, updateLeadDto);
    }
    async getLeadStats(user, query, userInfo) {
        return this.leadsStatsService.getLeadStatistics({
            userId: user.id,
            role: userInfo.roles[0],
            agency_id: userInfo.agency_profiles[0]?.id || null,
            filter: {
                type: query.type,
                monthName: query.monthName,
            },
        });
    }
    async assignConstructor(leadId, dto) {
        return this.leadsService.assignConstructorToLead(leadId, dto.constructor_id);
    }
    async reassignConstructor(leadId, dto) {
        return this.leadsService.reassignConstructor(leadId, dto.constructor_id);
    }
    async unassignConstructor(leadId) {
        return this.leadsService.unassignConstructor(leadId);
    }
    async updateProjectDetails(leadId, projectDetails, userInfo) {
        return this.leadsService.updateProjectDetails(leadId, projectDetails);
    }
};
exports.LeadsController = LeadsController;
__decorate([
    (0, common_1.Get)(""),
    (0, swagger_1.ApiOperation)({ summary: "Get user leads with pagination" }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, get_user_decorator_1.GetUserInformation)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User,
        leads_query_dto_1.GetLeadsQueryDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], LeadsController.prototype, "getUserLeads", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Get user leads with pagination" }),
    __param(0, (0, get_user_decorator_1.GetUserInformation)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String]),
    __metadata("design:returntype", Promise)
], LeadsController.prototype, "GetLeadById", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Update lead details" }),
    __param(0, (0, get_user_decorator_1.GetUserInformation)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String, LeadStatus_dto_1.UpdateLeadDto]),
    __metadata("design:returntype", Promise)
], LeadsController.prototype, "updateLead", null);
__decorate([
    (0, common_1.Get)("stats"),
    (0, swagger_1.ApiOperation)({ summary: "Get lead statistics (cached)" }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, get_user_decorator_1.GetUserInformation)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User,
        lead_stats_dto_1.LeadStatsQueryDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], LeadsController.prototype, "getLeadStats", null);
__decorate([
    (0, common_1.Patch)(":id/assign-constructor"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: "Assign a constructor to a lead",
        description: "Assigns a lead to a constructor and marks the lead as in progress",
    }),
    (0, swagger_1.ApiParam)({
        name: "id",
        description: "Lead ID",
        example: "550e8400-e29b-41d4-a716-446655440000",
    }),
    (0, swagger_1.ApiBody)({ type: assign_contructor_dto_1.AssignConstructorDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Constructor assigned successfully",
        type: lead_entity_1.Lead,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: "Lead not found",
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: "Lead already assigned",
    }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, assign_contructor_dto_1.AssignConstructorDto]),
    __metadata("design:returntype", Promise)
], LeadsController.prototype, "assignConstructor", null);
__decorate([
    (0, common_1.Patch)(":id/reassign-constructor"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: "Reassign constructor for a lead",
        description: "Replaces the currently assigned constructor with a new one",
    }),
    (0, swagger_1.ApiParam)({
        name: "id",
        description: "Lead ID",
    }),
    (0, swagger_1.ApiBody)({ type: assign_contructor_dto_1.AssignConstructorDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Constructor reassigned successfully",
        type: lead_entity_1.Lead,
    }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, assign_contructor_dto_1.AssignConstructorDto]),
    __metadata("design:returntype", Promise)
], LeadsController.prototype, "reassignConstructor", null);
__decorate([
    (0, common_1.Patch)(":id/unassign-constructor"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: "Unassign constructor from a lead",
        description: "Removes constructor assignment and resets lead status",
    }),
    (0, swagger_1.ApiParam)({
        name: "id",
        description: "Lead ID",
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Constructor unassigned successfully",
        type: lead_entity_1.Lead,
    }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LeadsController.prototype, "unassignConstructor", null);
__decorate([
    (0, common_1.Patch)(":id/project-details"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: "Update project details for a lead",
        description: "Updates the project details for a specific lead",
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Project details updated successfully",
        type: lead_entity_1.Lead,
    }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)("project_details")),
    __param(2, (0, get_user_decorator_1.GetUserInformation)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], LeadsController.prototype, "updateProjectDetails", null);
exports.LeadsController = LeadsController = __decorate([
    (0, swagger_1.ApiTags)("Leads"),
    (0, common_1.Controller)("leads"),
    (0, common_1.UseGuards)(session_auth_guard_1.JwtAuthenticationGuard, roles_guard_1.RolesGuard, checkBuisness_guard_1.CheckBuisnessGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.UserRoles.AGENCY_OWNER, role_enum_1.UserRoles.CONTRUCTOR),
    __metadata("design:paramtypes", [leads_query_service_1.LeadsQueryService,
        leads_stats_service_1.LeadsStatsService,
        leads_info_service_1.LeadsInfoService,
        lead_seed_service_1.LeadSeedService])
], LeadsController);
//# sourceMappingURL=leads_info.controller.js.map