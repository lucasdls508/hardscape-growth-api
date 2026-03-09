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
exports.JwtAuthenticationGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const logger_decorator_1 = require("../../shared/decorators/logger.decorator");
const user_service_1 = require("../../user/user.service");
const winston_1 = require("winston");
let JwtAuthenticationGuard = class JwtAuthenticationGuard {
    constructor(_jwtService, _userService, _logger) {
        this._jwtService = _jwtService;
        this._userService = _userService;
        this._logger = _logger;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new common_1.UnauthorizedException("You are not authorized to access this resource!");
        }
        try {
            const payload = await this._jwtService.verifyAsync(token);
            const user = await this._userService.getUserById(payload.id, ["agency_profiles", "buisness_profiles"]);
            if (!user) {
                throw new Error("User is Not Available!");
            }
            if (payload.id !== user.id.toString()) {
                throw new Error("You are not authorized to access this resource!");
            }
            if (user.deletedAt) {
                throw new Error("User is Not Available!");
            }
            request.user = payload;
            request.userInfo = user;
            console.log("user");
            return true;
        }
        catch (error) {
            console.log(error);
            throw new common_1.UnauthorizedException(error.message);
        }
    }
    extractTokenFromHeader(request) {
        const bearerToken = request.headers["authorization"];
        console.log("Bearer Token :", bearerToken);
        if (bearerToken && bearerToken.startsWith("Bearer ")) {
            return bearerToken.split(" ")[1];
        }
        return null;
    }
};
exports.JwtAuthenticationGuard = JwtAuthenticationGuard;
exports.JwtAuthenticationGuard = JwtAuthenticationGuard = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, logger_decorator_1.InjectLogger)()),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        user_service_1.UserService,
        winston_1.Logger])
], JwtAuthenticationGuard);
//# sourceMappingURL=session-auth.guard.js.map