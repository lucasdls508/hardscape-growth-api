"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountActivatedGuard = void 0;
const common_1 = require("@nestjs/common");
let AccountActivatedGuard = class AccountActivatedGuard {
    canActivate(context) {
        const { user, userInfo } = context.switchToHttp().getRequest();
        if (userInfo.status !== "not_verified")
            return false;
        throw new common_1.ForbiddenException("Please activate your account");
    }
};
exports.AccountActivatedGuard = AccountActivatedGuard;
exports.AccountActivatedGuard = AccountActivatedGuard = __decorate([
    (0, common_1.Injectable)()
], AccountActivatedGuard);
//# sourceMappingURL=account-activation.guard.js.map