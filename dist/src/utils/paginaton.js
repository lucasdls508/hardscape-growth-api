"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pagination = void 0;
const pagination = (page = 1, limit = 10) => {
    const safePage = Math.max(1, page);
    return { skip: (safePage - 1) * limit, take: limit };
};
exports.pagination = pagination;
//# sourceMappingURL=paginaton.js.map