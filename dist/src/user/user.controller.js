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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const create_agency_owner_dto_1 = require("../agency_profiles/dtos/create_agency_owner.dto");
const session_auth_guard_1 = require("../auth/guards/session-auth.guard");
const multer_config_1 = require("../common/multer/multer.config");
const get_user_decorator_1 = require("../auth/decorators/get-user.decorator");
const base_response_dto_1 = require("../shared/dto/base-response.dto");
const contructors_service_1 = require("./contructors/contructors.service");
const CreateAgencyMembers_dto_1 = require("./contructors/dto/CreateAgencyMembers.dto");
const roles_decorator_1 = require("./decorators/roles.decorator");
const get_user_query_dto_1 = require("./dto/get-user.query.dto");
const update_profile_dto_1 = require("./dto/update-profile.dto");
const update_user_dto_1 = require("./dto/update-user.dto");
const user_entity_1 = require("./entities/user.entity");
const role_enum_1 = require("./enums/role.enum");
const roles_guard_1 = require("./guards/roles.guard");
const user_service_1 = require("./user.service");
const userAddress_service_1 = require("./userAddress.service");
let UserController = class UserController {
    constructor(_userService, _userAddressService, _contructorService) {
        this._userService = _userService;
        this._userAddressService = _userAddressService;
        this._contructorService = _contructorService;
    }
    createAgencyOwner(body) {
        return this._userService.createUser({
            ...body,
            status: user_entity_1.USER_STATUS.VERIFIED,
            roles: [role_enum_1.UserRoles.AGENCY_OWNER],
        });
    }
    async createMember(body, user, userInfo) {
        const agencyId = userInfo.agency_profiles[0].id;
        console.log(agencyId);
        return await this._contructorService.createMember(body, agencyId);
    }
    async getAllUsers(query) {
        return this._userService.getUserFilters(query);
    }
    async getUser(user) {
        const userInfo = await this._userService.getMe(user.id);
        return { status: "success", data: userInfo };
    }
    async updateUserDetails(updateUserDto, user) {
        const updatedUser = await this._userService.updateUserData(updateUserDto, user);
        return updatedUser;
    }
    async verifyEmailChange(body, user) {
        return this._userService.verifyEmailChange(user.id, body.otp);
    }
    async updateProfilePicture(user, fileDestination) {
        console.log(fileDestination);
        await this._userService.updateImage({ imageUrl: fileDestination, user });
        return { status: "success", data: null, message: "Image updated successfully", statusCode: 200 };
    }
    async getUserById(id) {
        const user = await this._userService.getUserById(id);
        return { status: "success", data: user };
    }
    async getUserProfile(id) {
        const user = await this._userService.getUserById(id, ["reviews", "products"]);
        return { status: "success", data: user };
    }
    async updateProfile(user, req, updateDto) {
        if (req.file) {
            const length = req.file.path.split("/").length;
            updateDto.image = req.file.path.split("/").slice(1, length).join("/");
        }
        const updatedUser = await this._userService.updateProfile(user.id, updateDto);
        return {
            message: "Profile updated successfully",
            data: updatedUser,
            status: "success",
            statuscode: 200,
        };
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Post)(""),
    (0, swagger_1.ApiOperation)({ summary: "Create Agency Owner " }),
    (0, common_1.UseGuards)(session_auth_guard_1.JwtAuthenticationGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.UserRoles.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_agency_owner_dto_1.CreateAgencyOwnerDto]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "createAgencyOwner", null);
__decorate([
    (0, common_1.Post)("members"),
    (0, swagger_1.ApiOperation)({ summary: "Agency Owner adds a new Constructor Member" }),
    (0, common_1.UseGuards)(session_auth_guard_1.JwtAuthenticationGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.UserRoles.AGENCY_OWNER),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __param(2, (0, get_user_decorator_1.GetUserInformation)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateAgencyMembers_dto_1.CreateMemberDto,
        user_entity_1.User,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "createMember", null);
__decorate([
    (0, common_1.Get)("all"),
    (0, swagger_1.ApiOperation)({ summary: "Get all users with role USER (paginated + searchable)" }),
    (0, swagger_1.ApiQuery)({ name: "page", required: false, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: "limit", required: false, example: 10 }),
    (0, common_1.UseGuards)(session_auth_guard_1.JwtAuthenticationGuard),
    (0, swagger_1.ApiQuery)({ name: "search", required: false, description: "Search by first or last name" }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_user_query_dto_1.GetUsersQueryDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.Get)("me"),
    (0, common_1.UseGuards)(session_auth_guard_1.JwtAuthenticationGuard),
    (0, swagger_1.ApiOperation)({
        description: "Api to fetch details of logged in user.",
        summary: "Api to fetch details of logged in user.",
    }),
    (0, swagger_1.ApiOkResponse)({ description: "Get data about current logged in user", type: (base_response_dto_1.ApiResponseDto) }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUser", null);
__decorate([
    (0, common_1.Patch)("update-me"),
    (0, common_1.UseGuards)(session_auth_guard_1.JwtAuthenticationGuard),
    (0, swagger_1.ApiOperation)({
        description: "Api to update user details.",
        summary: "Api to update user details.",
    }),
    (0, swagger_1.ApiOkResponse)({ description: "Update User Data", type: (base_response_dto_1.ApiResponseDto) }),
    (0, swagger_1.ApiForbiddenResponse)({ description: "If the account is not activated" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_user_dto_1.UpdateUserDto, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUserDetails", null);
__decorate([
    (0, common_1.Post)("verify-email-change"),
    (0, common_1.UseGuards)(session_auth_guard_1.JwtAuthenticationGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "verifyEmailChange", null);
__decorate([
    (0, common_1.Patch)("upload-image"),
    (0, common_1.UseGuards)(session_auth_guard_1.JwtAuthenticationGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("image", multer_config_1.multerConfig)),
    (0, swagger_1.ApiOperation)({
        description: "Api to update user Profile Picture",
        summary: "Api to update user Profile Picture.",
    }),
    (0, swagger_1.ApiOkResponse)({ description: "Update User Data", type: (base_response_dto_1.ApiResponseDto) }),
    (0, swagger_1.ApiForbiddenResponse)({ description: "If the account is not activated" }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, get_user_decorator_1.GetFileDestination)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateProfilePicture", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, swagger_1.ApiOperation)({
        description: "Api to fetch profile details of an user",
        summary: "Api to fetch profile details of an user",
    }),
    (0, swagger_1.ApiOkResponse)({ description: "Get data about current logged in user", type: (base_response_dto_1.ApiResponseDto) }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserById", null);
__decorate([
    (0, common_1.Get)(":id/profile"),
    (0, swagger_1.ApiOperation)({
        description: "Api to fetch profile details of an user",
        summary: "Api to fetch profile details of an user",
    }),
    (0, swagger_1.ApiOkResponse)({ description: "Get data about current logged in user", type: (base_response_dto_1.ApiResponseDto) }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserProfile", null);
__decorate([
    (0, common_1.Patch)("profile"),
    (0, common_1.UseGuards)(session_auth_guard_1.JwtAuthenticationGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("image", multer_config_1.multerConfig)),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, Object, update_profile_dto_1.UpdateUserProfileDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateProfile", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)("users"),
    (0, swagger_1.ApiTags)("User"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: "In case user is not logged in" }),
    __metadata("design:paramtypes", [user_service_1.UserService,
        userAddress_service_1.UserAddressService,
        contructors_service_1.ContructorsService])
], UserController);
//# sourceMappingURL=user.controller.js.map