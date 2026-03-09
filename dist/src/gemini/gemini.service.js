"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const generative_ai_1 = require("@google/generative-ai");
let GeminiService = class GeminiService {
    constructor(configService) {
        this.configService = configService;
        this.genAI = new generative_ai_1.GoogleGenerativeAI(this.configService.get("GEMINI_API_KEY"));
        this.model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    }
    async analyzeTheProductImage(imageBuffer, mimeType) {
        const imagePart = {
            inlineData: {
                data: imageBuffer.toString("base64"),
                mimeType,
            },
        };
        const prompt = `
        Analyze the product image of a pet product and provide details in the following format:
      {
        "product_name": "Name of the pet product",
        "selling_price": 49.99,
        "purchasing_price": 30.00,
        "category": "Pet Toy", 
        "quantity": 10,
        "description": "A detailed description of the pet product, emphasizing the quality, age, and condition of the used item.",
        "condition": "Used - Like New",
        "size": "M",
        "brand": "PetBrand"
      }
    `;
        const result = await this.model.generateContent([prompt, imagePart]);
        const response = await result.response;
        const text = await response.text();
        let analysisResult = null;
        try {
            const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
            const jsonString = jsonMatch ? jsonMatch[1] : text;
            analysisResult = JSON.parse(jsonString);
            console.log("Analysis Result:", analysisResult);
        }
        catch (error) {
            throw new Error(`Failed to parse the response: ${error.message}`);
        }
        return analysisResult;
    }
};
exports.GeminiService = GeminiService;
exports.GeminiService = GeminiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], GeminiService);
//# sourceMappingURL=gemini.service.js.map