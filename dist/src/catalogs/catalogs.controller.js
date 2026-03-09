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
exports.CatalogsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const catalogs_service_1 = require("./catalogs.service");
const CreateCatalogs_dto_1 = require("./dtos/CreateCatalogs.dto");
const UpdateCatalogs_dto_1 = require("./dtos/UpdateCatalogs.dto");
const catalogs_entity_1 = require("./enitities/catalogs.entity");
const response_interceptor_1 = require("./interceptors/response.interceptor");
let CatalogsController = class CatalogsController {
    constructor(_catalogsService) {
        this._catalogsService = _catalogsService;
    }
    async create(body) {
        return this._catalogsService.create(body);
    }
    async findAll(page = "1", limit = "10", search) {
        return this._catalogsService.findAll(Number(page), Number(limit), search);
    }
    async findOne(id) {
        return this._catalogsService.findOne(id);
    }
    async update(id, body) {
        return this._catalogsService.update(id, body);
    }
    async remove(id) {
        await this._catalogsService.remove(id);
        return { message: "Catalog deleted successfully" };
    }
};
exports.CatalogsController = CatalogsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: "Create a new catalog item" }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "Catalog created successfully", type: catalogs_entity_1.Catalogs }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateCatalogs_dto_1.CreateCatalogDto]),
    __metadata("design:returntype", Promise)
], CatalogsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "Get all catalogs with pagination" }),
    (0, swagger_1.ApiQuery)({ name: "page", required: false, type: Number, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: "limit", required: false, type: Number, example: 10 }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Paginated list of catalogs" }),
    __param(0, (0, common_1.Query)("page")),
    __param(1, (0, common_1.Query)("limit")),
    __param(2, (0, common_1.Query)("search")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], CatalogsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Get a single catalog by ID" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Catalog found", type: catalogs_entity_1.Catalogs }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Catalog not found" }),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CatalogsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Update a catalog item" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Catalog updated successfully", type: catalogs_entity_1.Catalogs }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Catalog not found" }),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, UpdateCatalogs_dto_1.UpdateCatalogDto]),
    __metadata("design:returntype", Promise)
], CatalogsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Soft delete a catalog item" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Catalog deleted successfully" }),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CatalogsController.prototype, "remove", null);
exports.CatalogsController = CatalogsController = __decorate([
    (0, swagger_1.ApiTags)("Catalogs"),
    (0, common_1.Controller)("catalogs"),
    (0, common_1.UseInterceptors)(response_interceptor_1.CatalogResponseInterceptor),
    __metadata("design:paramtypes", [catalogs_service_1.CatalogsService])
], CatalogsController);
//# sourceMappingURL=catalogs.controller.js.map