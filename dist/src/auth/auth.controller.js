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
exports.AuthController = void 0;
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const swagger_1 = require("@nestjs/swagger");
const mail_service_1 = require("../mail/mail.service");
const otp_service_1 = require("../otp/otp.service");
const user_service_1 = require("../user/user.service");
const transform_interceptor_1 = require("../shared/interceptors/transform.interceptor");
const user_entity_1 = require("../user/entities/user.entity");
const auth_service_1 = require("./auth.service");
const get_user_decorator_1 = require("./decorators/get-user.decorator");
const logout_response_dto_1 = require("./dto-response/logout-response.dto");
const message_response_dto_1 = require("./dto-response/message-response.dto");
const user_response_dto_1 = require("./dto-response/user-response.dto");
const create_user_dto_1 = require("./dto/create-user.dto");
const forgot_password_dto_1 = require("./dto/forgot-password.dto");
const login_user_dto_1 = require("./dto/login-user.dto");
const otp_verification_dto_1 = require("./dto/otp-verification.dto");
const refresh_token_dto_1 = require("./dto/refresh-token.dto");
const reset_password_dto_1 = require("./dto/reset-password.dto");
const update_password_dto_1 = require("./dto/update-password.dto");
const forget_password_guard_1 = require("./guards/forget-password.guard");
const google_auth_guard_1 = require("./guards/google-auth.guard");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const session_auth_guard_1 = require("./guards/session-auth.guard");
let AuthController = class AuthController {
    constructor(_authService, _jwtService, _OtpService, _mailService, _userService, _queue) {
        this._authService = _authService;
        this._jwtService = _jwtService;
        this._OtpService = _OtpService;
        this._mailService = _mailService;
        this._userService = _userService;
        this._queue = _queue;
    }
    async signup(createUserDto, req) {
        const { data, token } = await this._authService.signup(createUserDto, req);
        return {
            ok: true,
            data,
            token,
        };
    }
    async loginPassportLocal(headers, loginDto, req) {
        loginDto.device_id = headers["user-agent"] || "unknown_device";
        return await this._authService.login(loginDto, req.ip);
    }
    async resendOtp(req, userInfo) {
        const user = req.user;
        if (!user) {
            throw new common_1.NotFoundException("User not found");
        }
        return await this._authService.resendOtp({ user: userInfo });
    }
    async forgotPassword(req, forgotPasswordDto) {
        return await this._authService.forgetPassword(req, forgotPasswordDto.email);
    }
    async VerifyOtp(otp, user) {
        const token = await this._authService.verifyOtp(otp, user);
        return token;
    }
    async ResetPassword(req, password) {
        const user = req.user;
        return await this._authService.resetPassword(password, user);
    }
    async updatePassword(user, password) {
        return await this._authService.updatePassword(password, user);
    }
    async loginGoogle() {
    }
    async loginAppleCallback(req) {
        const { token: appleToken } = req.body;
        const { user, token } = await this._authService.appleLogin(appleToken);
        return {
            status: "success",
            data: user,
            token,
        };
    }
    async logout() {
        return { status: "success", token: null };
    }
    async refresh(refreshTokenDto, headers) {
        refreshTokenDto.device_id = headers["user-agent"];
        return this._authService.refreshToken(refreshTokenDto);
    }
    async updateMyPassword(updateMyPassword, user) {
        const { user: updatedUser, token: newToken } = await this._authService.updateMyPassword(updateMyPassword, user);
        return { status: "success", user: updatedUser, token: newToken };
    }
    async deleteMyAccount() {
        const isDeleted = await this._authService.deleteMyAccount();
        if (isDeleted) {
            return { status: "success", message: "User Deleted Successfully" };
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)("signup"),
    (0, swagger_1.ApiOperation)({
        description: "Api to register new users.",
        summary: "Api to register new users. It takes (first_name, last_name, email and password) as input",
    }),
    (0, swagger_1.ApiCreatedResponse)({
        description: "The user is successfully created",
        type: user_response_dto_1.UserResponseDto,
    }),
    (0, swagger_1.ApiConflictResponse)({ description: "In case of email already exists in the database" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signup", null);
__decorate([
    (0, common_1.Post)("login"),
    (0, common_1.HttpCode)(200),
    (0, common_1.UseInterceptors)(transform_interceptor_1.TransformInterceptor),
    (0, swagger_1.ApiOperation)({
        description: "Api to login already registered user.",
        summary: "Api to login already registered user.",
    }),
    (0, swagger_1.ApiCreatedResponse)({ description: "Login successful", type: user_response_dto_1.UserResponseDto }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: "Invalid credentials" }),
    (0, swagger_1.ApiBody)({ required: true, type: login_user_dto_1.LoginUserDto }),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, login_user_dto_1.LoginUserDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "loginPassportLocal", null);
__decorate([
    (0, common_1.Post)("resend-otp"),
    (0, common_1.UseGuards)(session_auth_guard_1.JwtAuthenticationGuard),
    (0, common_1.UseInterceptors)(transform_interceptor_1.TransformInterceptor),
    (0, swagger_1.ApiOperation)({
        description: "Api to Resend otp.",
        summary: "Api to Resend the otp.",
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: "Session Expired!" }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, get_user_decorator_1.GetUserInformation)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resendOtp", null);
__decorate([
    (0, common_1.Post)("forgot-password"),
    (0, common_1.UseInterceptors)(transform_interceptor_1.TransformInterceptor),
    (0, swagger_1.ApiOperation)({
        description: "Forget Password",
        summary: "Forget password and send otp",
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: "Session Expired!" }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, forgot_password_dto_1.ForgotPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)("verify-otp"),
    (0, common_1.UseGuards)(session_auth_guard_1.JwtAuthenticationGuard),
    (0, common_1.UseInterceptors)(transform_interceptor_1.TransformInterceptor),
    (0, swagger_1.ApiOperation)({
        description: "Otp Verification",
        summary: "Verify the otp .",
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: "Session Expired!" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [otp_verification_dto_1.OtpVerificationDto, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "VerifyOtp", null);
__decorate([
    (0, common_1.Post)("reset-password"),
    (0, common_1.UseGuards)(forget_password_guard_1.ForgetPasswordGuard),
    (0, common_1.UseInterceptors)(transform_interceptor_1.TransformInterceptor),
    (0, swagger_1.ApiOperation)({
        description: "Reset Password",
        summary: "Reset Password .",
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: "Session Expired!" }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, reset_password_dto_1.ResetPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "ResetPassword", null);
__decorate([
    (0, common_1.Post)("update-password"),
    (0, common_1.UseGuards)(session_auth_guard_1.JwtAuthenticationGuard),
    (0, common_1.UseInterceptors)(transform_interceptor_1.TransformInterceptor),
    (0, swagger_1.ApiOperation)({
        description: "update Password",
        summary: "updated Password .",
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: "Session Expired!" }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, update_password_dto_1.UpdateMyPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updatePassword", null);
__decorate([
    (0, common_1.Get)("google"),
    (0, common_1.UseGuards)(google_auth_guard_1.GoogleAuthGuard),
    (0, swagger_1.ApiOperation)({
        description: "Api to login user through Google account.",
        summary: "Api to login user through Google account.",
    }),
    (0, swagger_1.ApiResponse)({ status: 302, description: "Redirect to Google OAuth Content Screen" }),
    (0, swagger_1.ApiOAuth2)(["email", "profile"]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "loginGoogle", null);
__decorate([
    (0, common_1.Post)("apple/callback"),
    (0, swagger_1.ApiOkResponse)({
        description: "Created or found Existing user and Login successful",
        type: user_response_dto_1.UserResponseDto,
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: "Invalid credentials" }),
    (0, swagger_1.ApiConflictResponse)({ description: "User Already Exists" }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "loginAppleCallback", null);
__decorate([
    (0, common_1.Get)("logout"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        description: "Api to logout logged in user.",
        summary: "Api to logout logged in user.",
    }),
    (0, swagger_1.ApiOkResponse)({ description: "Logout Successful", type: logout_response_dto_1.LogoutResponseDto }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: "If User is not logged in" }),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Post)("refresh-token"),
    (0, swagger_1.ApiOperation)({ summary: "Refresh access token using a valid refresh token" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [refresh_token_dto_1.RefreshTokenDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.Patch)("update-my-password"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        description: "Api to change password of current logged in user.",
        summary: "Api to change password of current logged in user.",
    }),
    (0, swagger_1.ApiOkResponse)({ description: "Password Updated Successfully", type: user_response_dto_1.UserResponseDto }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: "If User is not logged in OR If input password and user password does not match",
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: "If given new password and user password are same OR if given new password and passwordConfirm are different",
    }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_password_dto_1.UpdateMyPasswordDto, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updateMyPassword", null);
__decorate([
    (0, common_1.Delete)("delete-me"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        description: "Api to delete logged in user's account",
        summary: "Api to delete logged in user's account.",
    }),
    (0, swagger_1.ApiOkResponse)({ description: "User deletion successful", type: message_response_dto_1.MessageResponseDto }),
    (0, swagger_1.ApiBadRequestResponse)({ description: "If User does not exist" }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: "If User is not logged in" }),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "deleteMyAccount", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)("auth"),
    (0, swagger_1.ApiTags)("Auth"),
    __param(5, (0, bull_1.InjectQueue)("notifications")),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        jwt_1.JwtService,
        otp_service_1.OtpService,
        mail_service_1.MailService,
        user_service_1.UserService, Object])
], AuthController);
//# sourceMappingURL=auth.controller.js.map