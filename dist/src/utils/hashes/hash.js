"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenCreate = exports.sha256 = exports.sha3Hash = void 0;
const crypto_1 = require("crypto");
const sha3Hash = (data) => (0, crypto_1.createHash)("sha3-256").update(data).digest("hex");
exports.sha3Hash = sha3Hash;
const sha256 = (data) => (0, crypto_1.createHash)("sha256").update(data).digest("hex");
exports.sha256 = sha256;
const tokenCreate = (length) => (0, crypto_1.randomBytes)(length || 32).toString("hex");
exports.tokenCreate = tokenCreate;
//# sourceMappingURL=hash.js.map