"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatbotModule = void 0;
const common_1 = require("@nestjs/common");
const chatbot_service_1 = require("./chatbot.service");
const lang_chain_open_ai_module_1 = require("../lang-chain-open-ai/lang-chain-open-ai.module");
const lang_chain_open_ai_service_1 = require("../lang-chain-open-ai/lang-chain-open-ai.service");
const chatbot_controller_1 = require("./chatbot.controller");
const chat_conversation_service_1 = require("./services/chat-conversation.service");
const conversation_state_service_1 = require("./services/conversation-state.service");
const chatbot_utils_service_1 = require("./utils/chatbot.utils.service");
let ChatbotModule = class ChatbotModule {
};
exports.ChatbotModule = ChatbotModule;
exports.ChatbotModule = ChatbotModule = __decorate([
    (0, common_1.Module)({
        imports: [lang_chain_open_ai_module_1.LangChainOpenAiModule],
        controllers: [chatbot_controller_1.ChatbotController],
        providers: [
            chatbot_service_1.ChatbotService,
            lang_chain_open_ai_service_1.LangChainOpenAIService,
            chat_conversation_service_1.ConversationMemoryService,
            conversation_state_service_1.ConversationStateService,
            chatbot_utils_service_1.ChatbotUtilsService,
        ],
        exports: [chatbot_service_1.ChatbotService],
    })
], ChatbotModule);
//# sourceMappingURL=chatbot.module.js.map