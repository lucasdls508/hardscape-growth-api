"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserRole = void 0;
const common_1 = require("@nestjs/common");
exports.GetUserRole = (0, common_1.createParamDecorator)((role, ctx) => {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user;
    if (user && user.roles.includes(role)) {
        return true;
    }
    throw new common_1.BadRequestException("You are not allowed to use the resource");
});
//# sourceMappingURL=checkAdmin.decorator.js.map