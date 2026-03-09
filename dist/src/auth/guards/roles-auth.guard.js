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
exports.RolesGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("./jwt-auth.guard");
const core_1 = require("@nestjs/core");
const jwt_1 = require("@nestjs/jwt");
const user_service_1 = require("../../user/user.service");
let RolesGuard = class RolesGuard extends jwt_auth_guard_1.JwtAuthGuard {
    constructor(_reflector, jwtService, userService) {
        super(jwtService, userService);
        this._reflector = _reflector;
    }
    async canActivate(context) {
        const roles = this._reflector.get("roles", context.getHandler());
        if (!roles) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const userInfo = request.userInfo;
        const hasRole = roles.some((role) => {
            return userInfo.roles?.includes(role);
        });
        if (!hasRole) {
            throw new common_1.ForbiddenException("You do not have the required role !");
        }
        return true;
    }
};
exports.RolesGuard = RolesGuard;
exports.RolesGuard = RolesGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        jwt_1.JwtService,
        user_service_1.UserService])
], RolesGuard);
//# sourceMappingURL=roles-auth.guard.js.map