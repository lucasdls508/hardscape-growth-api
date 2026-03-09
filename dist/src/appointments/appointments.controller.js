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
exports.AppointmentsController = void 0;
const common_1 = require("@nestjs/common");
const get_user_decorator_1 = require("../auth/decorators/get-user.decorator");
const session_auth_guard_1 = require("../auth/guards/session-auth.guard");
const roles_decorator_1 = require("../user/decorators/roles.decorator");
const user_entity_1 = require("../user/entities/user.entity");
const role_enum_1 = require("../user/enums/role.enum");
const roles_guard_1 = require("../user/guards/roles.guard");
const appointments_service_1 = require("./appointments.service");
const CreateAppointments_dto_1 = require("./dto/CreateAppointments.dto");
const UpdateAppointments_dto_1 = require("./dto/UpdateAppointments.dto");
let AppointmentsController = class AppointmentsController {
    constructor(_appointmentsService) {
        this._appointmentsService = _appointmentsService;
    }
    findAll(userInfo, page = 1, limit = 10, startDate, endDate, searchTerm) {
        const agencyId = userInfo.agency_profiles[0].id;
        return this._appointmentsService.findAllByAgency(agencyId, +page, +limit, startDate, endDate, searchTerm);
    }
    async getByLeadId(leadId, page, limit) {
        return this._appointmentsService.getAppointmentsByLeadId(leadId, page, limit);
    }
    findOne(id) {
        return this._appointmentsService.findOne(id);
    }
    create(createDto, userInfo) {
        return this._appointmentsService.create({
            ...createDto,
            agency_owner_id: userInfo.agency_profiles[0].id,
        });
    }
    update(id, updateDto) {
        return this._appointmentsService.update(id, updateDto);
    }
    remove(id) {
        return this._appointmentsService.remove(id);
    }
};
exports.AppointmentsController = AppointmentsController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(session_auth_guard_1.JwtAuthenticationGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.UserRoles.AGENCY_OWNER, role_enum_1.UserRoles.CONTRUCTOR),
    __param(0, (0, get_user_decorator_1.GetUserInformation)()),
    __param(1, (0, common_1.Query)("page")),
    __param(2, (0, common_1.Query)("limit")),
    __param(3, (0, common_1.Query)("startDate")),
    __param(4, (0, common_1.Query)("endDate")),
    __param(5, (0, common_1.Query)("searchTerm")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, Object, Object, String, String, String]),
    __metadata("design:returntype", void 0)
], AppointmentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("lead/:leadId"),
    __param(0, (0, common_1.Param)("leadId")),
    __param(1, (0, common_1.Query)("page", new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)("limit", new common_1.DefaultValuePipe(10), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "getByLeadId", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AppointmentsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(session_auth_guard_1.JwtAuthenticationGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.UserRoles.AGENCY_OWNER, role_enum_1.UserRoles.CONTRUCTOR),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_user_decorator_1.GetUserInformation)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateAppointments_dto_1.CreateAppointmentDto, user_entity_1.User]),
    __metadata("design:returntype", void 0)
], AppointmentsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, common_1.UseGuards)(session_auth_guard_1.JwtAuthenticationGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.UserRoles.AGENCY_OWNER, role_enum_1.UserRoles.CONTRUCTOR),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, UpdateAppointments_dto_1.UpdateAppointmentDto]),
    __metadata("design:returntype", void 0)
], AppointmentsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AppointmentsController.prototype, "remove", null);
exports.AppointmentsController = AppointmentsController = __decorate([
    (0, common_1.Controller)("appointments"),
    __metadata("design:paramtypes", [appointments_service_1.AppointmentsService])
], AppointmentsController);
//# sourceMappingURL=appointments.controller.js.map