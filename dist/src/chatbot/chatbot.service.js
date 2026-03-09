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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatbotService = void 0;
const common_1 = require("@nestjs/common");
const lang_chain_open_ai_service_1 = require("../lang-chain-open-ai/lang-chain-open-ai.service");
const logger_decorator_1 = require("../shared/decorators/logger.decorator");
const chat_conversation_service_1 = require("./services/chat-conversation.service");
const conversation_state_service_1 = require("./services/conversation-state.service");
const chatbot_types_1 = require("./types/chatbot.types");
const chatbot_utils_service_1 = require("./utils/chatbot.utils.service");
let ChatbotService = class ChatbotService {
    constructor(_langchain, _memoryService, _stateService, _chatbotUtils, _logger) {
        this._langchain = _langchain;
        this._memoryService = _memoryService;
        this._stateService = _stateService;
        this._chatbotUtils = _chatbotUtils;
        this._logger = _logger;
    }
    async chatWithForm(clientId, userMessage, formData, userInfo) {
        try {
            let context = await this._memoryService.getClientContext(clientId);
            if (!context || !chatbot_types_1.contextTypeGuards.isFormContext(context)) {
                context = await this._stateService.initializeFormContext(clientId, formData, userInfo);
            }
            await this._processMessage(context, userMessage);
            return this._formatResponse(context);
        }
        catch (error) {
            this._logger.error("Form chat error", { clientId, userMessage, error });
            throw new Error("Failed to process chat message");
        }
    }
    async chatRaw(clientId, userMessage, userInfo) {
        try {
            let context = await this._memoryService.getClientContext(clientId);
            if (!context || !chatbot_types_1.contextTypeGuards.isRawContext(context)) {
                context = await this._stateService.initializeRawContext(clientId, userInfo);
            }
            console.log(context);
            await this._processMessage(context, userMessage);
            return this._formatResponse(context);
        }
        catch (error) {
            this._logger.log("Raw chat error", { clientId, userMessage, error });
            throw new Error("Failed to process chat message");
        }
    }
    async _processMessage(context, userMessage) {
        const userMsg = {
            role: "user",
            content: userMessage,
            timestamp: new Date(),
        };
        await this._memoryService.saveMessage(context.id, userMsg);
        context.conversationHistory.push(userMsg);
        if (chatbot_types_1.contextTypeGuards.isFormContext(context)) {
            const extractedData = await this._langchain.extractStructuredData(userMessage, context.formData);
            extractedData.forEach((value, key) => {
                context.collectedData.set(key, value);
            });
        }
        else {
            const extractedData = await this._langchain.extractStructuredInformation(userMessage);
            extractedData.forEach((value, key) => {
                context.collectedData.set(key, value);
            });
        }
        context.status = await this._stateService.determineNextStatus(context);
        const aiResponse = await this._langchain.generateResponse(context, userMessage);
        const assistantMsg = {
            role: "assistant",
            content: aiResponse,
            timestamp: new Date(),
        };
        await this._memoryService.saveMessage(context.id, assistantMsg);
        context.conversationHistory.push(assistantMsg);
        await this._memoryService.saveClientContext(context.id, context);
        this._stateService.updateLastActivity(context);
    }
    _formatResponse(context) {
        return {
            message: context.conversationHistory[context.conversationHistory.length - 1]?.content || "",
            nextAction: this._getNextAction(context.status),
            suggestedQuestions: this._generateSuggestedQuestions(context),
            collectedFields: context.collectedData,
        };
    }
    _generateSuggestedQuestions(context) {
        switch (context.status) {
            case "greeting":
                return this._generateGreetingQuestions();
            case "information_gathering":
                return this._generateInfoGatheringQuestions(context);
            case "appointment_scheduling":
                return this._generateSchedulingQuestions();
            case "closing":
                return this._generateClosingQuestions();
            default:
                return ["How can I help you?", "What would you like to know?"];
        }
    }
    _generateGreetingQuestions() {
        return ["Tell me about your project", "What are your main challenges?", "What brings you here today?"];
    }
    _generateInfoGatheringQuestions(context) {
        const questions = [];
        if (chatbot_types_1.contextTypeGuards.isFormContext(context)) {
            const fieldStatus = this._stateService.getRequiredFieldsStatus(context);
            if (fieldStatus.remaining.length > 0) {
                const missingFieldName = fieldStatus.remaining[0];
                questions.push(this._generateFieldQuestion(missingFieldName));
                questions.push(this._generateFieldFollowup(missingFieldName));
            }
            else {
                questions.push("Is there anything else you'd like to add?");
            }
        }
        else {
            questions.push("Can you tell me more about yourself?");
            questions.push("What specific information do you need?");
        }
        return questions;
    }
    _generateSchedulingQuestions() {
        return [
            "When are you available for a call?",
            "Would you like to schedule a demo?",
            "What time works best for you?",
            "Can we schedule this week?",
        ];
    }
    _generateClosingQuestions() {
        return [
            "Is there anything else I can help with?",
            "Would you like to stay updated?",
            "Any final questions before we wrap up?",
        ];
    }
    _generateFieldQuestion(fieldName) {
        const questionMap = {
            full_name: "What's your full name?",
            email: "What's your email address?",
            phone: "What's the best phone number to reach you?",
            company: "What company are you with?",
            budget: "What's your estimated budget?",
            timeline: "When do you need this completed?",
            industry: "What industry are you in?",
            project_type: "What type of project are you interested in?",
            location: "Where is your business located?",
            website: "Do you have a website?",
        };
        return questionMap[fieldName] || `Can you provide your ${fieldName}?`;
    }
    _generateFieldFollowup(fieldName) {
        const followupMap = {
            full_name: "I appreciate that, thank you!",
            email: "Got it! We'll send updates to that email.",
            phone: "Perfect, we'll contact you at that number.",
            company: "Great! What services does your company provide?",
            budget: "Thanks for sharing that budget range.",
            timeline: "That helps us plan accordingly.",
            industry: "Interesting industry! What's your specific challenge?",
            project_type: "That project sounds interesting.",
            location: "Thanks! We serve that area.",
            website: "Feel free to share the link if you'd like.",
        };
        return followupMap[fieldName] || "Thanks for that information!";
    }
    _getNextAction(status) {
        const actions = {
            greeting: "Establish rapport and understand client needs",
            information_gathering: "Collect missing required information",
            appointment_scheduling: "Propose and confirm appointment/demo",
            closing: "Summarize and schedule follow-up",
        };
        return actions[status] || "Continue conversation";
    }
    async getConversationHistory(clientId) {
        return this._memoryService.getConversationHistory(clientId);
    }
    async getClientContext(clientId) {
        return this._memoryService.getClientContext(clientId);
    }
    async clearConversation(clientId) {
        await this._memoryService.clearConversation(clientId);
    }
    async getSessionStats(clientId) {
        const context = await this._memoryService.getClientContext(clientId);
        if (!context)
            return null;
        const userInformation = this._chatbotUtils.extractClientUserInfo(context);
        const baseStats = {
            clientId,
            status: context.status,
            startedAt: context.metadata.startedAt,
            lastActivityAt: context.metadata.lastActivityAt,
            duration: new Date().getTime() - context.metadata.startedAt.getTime(),
            messageCount: context.conversationHistory.length,
            collectedData: Object.fromEntries(context.collectedData),
            representative: `${userInformation.first_name} ${userInformation.last_name}`,
        };
        if (chatbot_types_1.contextTypeGuards.isFormContext(context)) {
            const fieldStatus = this._stateService.getRequiredFieldsStatus(context);
            return {
                ...baseStats,
                fieldsCollected: fieldStatus.collected,
                totalFieldsRequired: fieldStatus.total,
                collectionProgress: `${fieldStatus.progress}%`,
                contextType: "form",
            };
        }
        return {
            ...baseStats,
            contextType: "raw",
        };
    }
};
exports.ChatbotService = ChatbotService;
exports.ChatbotService = ChatbotService = __decorate([
    (0, common_1.Injectable)(),
    __param(4, (0, logger_decorator_1.InjectLogger)()),
    __metadata("design:paramtypes", [lang_chain_open_ai_service_1.LangChainOpenAIService,
        chat_conversation_service_1.ConversationMemoryService,
        conversation_state_service_1.ConversationStateService,
        chatbot_utils_service_1.ChatbotUtilsService,
        common_1.Logger])
], ChatbotService);
//# sourceMappingURL=chatbot.service.js.map