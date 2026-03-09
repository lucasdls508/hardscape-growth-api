"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LangChainOpenAiModule = void 0;
const common_1 = require("@nestjs/common");
const chatbot_utils_service_1 = require("../chatbot/utils/chatbot.utils.service");
const lang_chain_open_ai_controller_1 = require("./lang-chain-open-ai.controller");
const lang_chain_open_ai_service_1 = require("./lang-chain-open-ai.service");
let LangChainOpenAiModule = class LangChainOpenAiModule {
};
exports.LangChainOpenAiModule = LangChainOpenAiModule;
exports.LangChainOpenAiModule = LangChainOpenAiModule = __decorate([
    (0, common_1.Module)({
        controllers: [lang_chain_open_ai_controller_1.LangChainOpenAiController],
        providers: [lang_chain_open_ai_service_1.LangChainOpenAIService, chatbot_utils_service_1.ChatbotUtilsService],
        exports: [lang_chain_open_ai_service_1.LangChainOpenAIService],
    })
], LangChainOpenAiModule);
//# sourceMappingURL=lang-chain-open-ai.module.js.map