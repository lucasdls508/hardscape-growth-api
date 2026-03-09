"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeeWithCommision = FeeWithCommision;
exports.validateAddress = validateAddress;
function FeeWithCommision(charge, percent = 10) {
    return Number(((charge * percent) / 100).toFixed(2));
}
function validateAddress({ dto, requiredFields, }) {
    for (const field of requiredFields) {
        if (!dto[field] || typeof dto[field] !== "string" || !dto[field].trim()) {
            throw new Error(`Invalid or missing field: ${field}`);
        }
        if (dto[field] && typeof dto[field] !== "string") {
            throw new Error(`${dto[field]} must be a string`);
        }
    }
}
//# sourceMappingURL=utils.js.map