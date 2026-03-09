"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unescapeHtml = unescapeHtml;
function unescapeHtml(escaped) {
    return escaped
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
}
//# sourceMappingURL=unScapeHtml.js.map