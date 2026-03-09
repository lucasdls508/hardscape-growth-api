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
exports.ForgetPasswordGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const otp_entity_1 = require("../../otp/entities/otp.entity");
const user_service_1 = require("../../user/user.service");
let ForgetPasswordGuard = class ForgetPasswordGuard {
    constructor(jwtService, userService) {
        this.jwtService = jwtService;
        this.userService = userService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        console.log("Forget Password Guard Activated");
        const token = this.extractTokenFromHeader(request);
        console.log("Toekn", token);
        if (!token) {
            throw new common_1.UnauthorizedException("You are not authorized to access this resource!");
        }
        console.log(token);
        try {
            const payload = await this.jwtService.verifyAsync(token);
            console.log(payload);
            if (payload.verification_type !== otp_entity_1.OtpType.FORGOT_PASSWORD) {
                throw new common_1.UnauthorizedException("Invalid token type for forget password!");
            }
            const user = await this.userService.getUserById(payload.id);
            console.log(user);
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
            return true;
        }
        catch (error) {
            console.log(error);
            throw new common_1.UnauthorizedException(error.message);
        }
    }
    extractTokenFromHeader(request) {
        const bearerToken = request.headers["authorization"];
        if (bearerToken && bearerToken.startsWith("Bearer ")) {
            return bearerToken.split(" ")[1];
        }
        return null;
    }
};
exports.ForgetPasswordGuard = ForgetPasswordGuard;
exports.ForgetPasswordGuard = ForgetPasswordGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        user_service_1.UserService])
], ForgetPasswordGuard);
//# sourceMappingURL=forget-password.guard.js.map