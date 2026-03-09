"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pagination = pagination;
function pagination({ page = 1, limit = 10, total }) {
    const totalPages = Math.ceil(total / limit);
    return {
        page,
        limit,
        total,
        totalPages,
    };
}
//# sourceMappingURL=pagination.js.map