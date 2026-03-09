"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CatalogResponseInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
let CatalogResponseInterceptor = class CatalogResponseInterceptor {
    intercept(context, next) {
        return next.handle().pipe((0, rxjs_1.map)((data) => ({
            ok: true,
            message: this.getMessage(context),
            ...data,
        })));
    }
    getMessage(context) {
        const req = context.switchToHttp().getRequest();
        switch (req.method) {
            case "POST":
                return "Catalogs Created successfully";
            case "PATCH":
                return "Catalog Updated successfully";
            case "DELETE":
                return "Catalog Deleted successfully";
            case "GET":
            default:
                return "Request successful";
        }
    }
};
exports.CatalogResponseInterceptor = CatalogResponseInterceptor;
exports.CatalogResponseInterceptor = CatalogResponseInterceptor = __decorate([
    (0, common_1.Injectable)()
], CatalogResponseInterceptor);
//# sourceMappingURL=response.interceptor.js.map