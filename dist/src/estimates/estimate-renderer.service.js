"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var EstimateRendererService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EstimateRendererService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const fs_1 = __importDefault(require("fs"));
const handlebars_1 = __importDefault(require("handlebars"));
const path = __importStar(require("path"));
let EstimateRendererService = EstimateRendererService_1 = class EstimateRendererService {
    constructor(config) {
        this.config = config;
        this.logger = new common_1.Logger(EstimateRendererService_1.name);
    }
    onModuleInit() {
        const templatePath = path.resolve(__dirname, "..", "..", "..", "src/estimates/templates", "estimate.template.hbs");
        console.log(templatePath);
        if (!fs_1.default.existsSync(templatePath)) {
            throw new Error(`HBS template not found at: ${templatePath}`);
        }
        const source = fs_1.default.readFileSync(templatePath, "utf-8");
        this.compiledTemplate = handlebars_1.default.compile(source);
        this.logger.log("Estimate HBS template compiled and cached");
    }
    render(estimate) {
        const lead = estimate.lead;
        const preparedBy = estimate.prepared_by_user
            ? `${estimate.prepared_by_user.first_name} ${estimate.prepared_by_user.last_name}`
            : "Contractor";
        const issuedDate = new Date(estimate.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
        let totalCost = 0;
        let totalPrice = 0;
        const catalogItems = (estimate.estimate_catalogs ?? []).map((item, i) => {
            const qty = parseFloat(item.quantity);
            const cost = parseFloat(item.unit_cost);
            const price = parseFloat(item.unit_price);
            const rowTotal = qty * price;
            totalCost += qty * cost;
            totalPrice += rowTotal;
            return {
                rowIndex: i + 1,
                name: item.catalog?.name ?? "",
                desc: item.catalog?.desc ?? "",
                quantity: qty,
                unitCost: cost.toFixed(2),
                unitPrice: price.toFixed(2),
                rowTotal: rowTotal.toFixed(2),
            };
        });
        const apiBase = this.config.get("BASE_URL", "http://localhost:4500");
        return this.compiledTemplate({
            estimate,
            lead,
            preparedBy,
            issuedDate,
            catalogItems,
            totalCost: totalCost.toFixed(2),
            totalPrice: totalPrice.toFixed(2),
            apiBase,
            isSigned: !!estimate.lead_signature,
        });
    }
};
exports.EstimateRendererService = EstimateRendererService;
exports.EstimateRendererService = EstimateRendererService = EstimateRendererService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EstimateRendererService);
//# sourceMappingURL=estimate-renderer.service.js.map