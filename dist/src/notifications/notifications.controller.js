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
exports.NotificationsController = void 0;
const common_1 = require("@nestjs/common");
const get_user_decorator_1 = require("../auth/decorators/get-user.decorator");
const session_auth_guard_1 = require("../auth/guards/session-auth.guard");
const user_entity_1 = require("../user/entities/user.entity");
const role_enum_1 = require("../user/enums/role.enum");
const notifications_entity_1 = require("./entities/notifications.entity");
const notifications_service_1 = require("./notifications.service");
let NotificationsController = class NotificationsController {
    constructor(notificationService) {
        this.notificationService = notificationService;
    }
    async getNotifications(user, req, page = 1, limit = 10, isRead = false, related, isImportant = false, notificationFor) {
        let roleInfo = role_enum_1.UserRoles.USER;
        if (req.userInfo.roles.includes(role_enum_1.UserRoles.ADMIN)) {
            notificationFor = role_enum_1.UserRoles.ADMIN;
            roleInfo = role_enum_1.UserRoles.ADMIN;
        }
        const notificationsResponse = await this.notificationService.getNotifications({
            recepient_id: roleInfo === role_enum_1.UserRoles.ADMIN ? null : user.id,
            page,
            limit,
            isRead,
            related,
            isImportant,
            notificationFor: roleInfo,
        });
        return notificationsResponse;
    }
};
exports.NotificationsController = NotificationsController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(session_auth_guard_1.JwtAuthenticationGuard),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Query)("page")),
    __param(3, (0, common_1.Query)("limit")),
    __param(4, (0, common_1.Query)("isRead")),
    __param(5, (0, common_1.Query)("related")),
    __param(6, (0, common_1.Query)("isImportant")),
    __param(7, (0, common_1.Query)("notificationFor")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, Object, Number, Number, Boolean, String, Boolean, String]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "getNotifications", null);
exports.NotificationsController = NotificationsController = __decorate([
    (0, common_1.Controller)("notifications"),
    __metadata("design:paramtypes", [notifications_service_1.NotificationsService])
], NotificationsController);
//# sourceMappingURL=notifications.controller.js.map