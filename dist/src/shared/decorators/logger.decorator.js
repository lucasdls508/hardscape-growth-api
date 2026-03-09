"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InjectLogger = void 0;
const common_1 = require("@nestjs/common");
const nest_winston_1 = require("nest-winston");
const InjectLogger = () => (0, common_1.Inject)(nest_winston_1.WINSTON_MODULE_NEST_PROVIDER);
exports.InjectLogger = InjectLogger;
//# sourceMappingURL=logger.decorator.js.map