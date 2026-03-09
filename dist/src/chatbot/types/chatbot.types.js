"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contextTypeGuards = void 0;
exports.contextTypeGuards = {
    isFormContext(context) {
        return context.type === "form";
    },
    isRawContext(context) {
        return context.type === "raw";
    },
    hasFormData(context) {
        return context.type === "form" && Array.isArray(context.formData) && context.formData.length > 0;
    },
    getFormData(context) {
        return context.type === "form" ? context.formData : null;
    },
    assertFormContext(context) {
        if (!exports.contextTypeGuards.isFormContext(context)) {
            throw new Error("Context is not a form context");
        }
        return context;
    },
};
//# sourceMappingURL=chatbot.types.js.map