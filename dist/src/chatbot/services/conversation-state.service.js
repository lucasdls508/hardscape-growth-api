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
exports.ConversationStateService = void 0;
const common_1 = require("@nestjs/common");
const logger_decorator_1 = require("../../shared/decorators/logger.decorator");
let ConversationStateService = class ConversationStateService {
    constructor(_logger) {
        this._logger = _logger;
    }
    createMetadata() {
        return {
            startedAt: new Date(),
            lastActivityAt: new Date(),
            sourceChannel: "chat",
        };
    }
    createBaseContext(clientId, userInfo) {
        return {
            id: clientId,
            userInfo,
            conversationHistory: [],
            status: "greeting",
            collectedData: new Map(),
            metadata: this.createMetadata(),
        };
    }
    async initializeFormContext(clientId, formData, userInfo) {
        const context = {
            ...this.createBaseContext(clientId, userInfo),
            type: "form",
            formData,
        };
        this._logger.log("Form context initialized", {
            clientId,
            fieldCount: formData.length,
        });
        return context;
    }
    async initializeRawContext(clientId, userInfo) {
        try {
            const context = {
                ...this.createBaseContext(clientId, userInfo),
                type: "raw",
            };
            this._logger.log("Raw context initialized", { clientId });
            console.log("raw context");
            return context;
        }
        catch (error) {
            console.log(error);
        }
    }
    async determineNextStatus(context) {
        if (context.type === "form") {
            const fieldStatus = this.getRequiredFieldsStatus(context);
            if (fieldStatus.remaining.length === 0) {
                return "appointment_scheduling";
            }
            else if (context.conversationHistory.length > 2) {
                return "information_gathering";
            }
        }
        else {
            const messageCount = context.conversationHistory.length;
            if (messageCount < 3)
                return "greeting";
            if (messageCount < 6)
                return "information_gathering";
            return "appointment_scheduling";
        }
        return context.status;
    }
    getRequiredFieldsStatus(context) {
        if (context.type !== "form") {
            return { total: 0, collected: 0, remaining: [], progress: 100 };
        }
        const { formData, collectedData } = context;
        const remaining = formData.filter((field) => !collectedData.has(field.name)).map((f) => f.name);
        const collected = formData.length - remaining.length;
        const progress = formData.length > 0 ? (collected / formData.length) * 100 : 100;
        return {
            total: formData.length,
            collected,
            remaining,
            progress: Math.round(progress),
        };
    }
    areAllFieldsCollected(context) {
        if (context.type !== "form")
            return true;
        return context.formData.every((field) => context.collectedData.has(field.name));
    }
    getRemainingFields(context) {
        if (context.type !== "form")
            return [];
        return context.formData.filter((field) => !context.collectedData.has(field.name));
    }
    getNextMissingField(context) {
        const remaining = this.getRemainingFields(context);
        return remaining.length > 0 ? remaining[0] : null;
    }
    markFieldCollected(context, fieldName, value) {
        context.collectedData.set(fieldName, value);
        this._logger.debug("Field collected", { fieldName, clientId: context.id });
    }
    resetContext(context) {
        context.conversationHistory = [];
        context.collectedData.clear();
        context.status = "greeting";
        context.metadata.lastActivityAt = new Date();
        this._logger.log("Context reset", { clientId: context.id });
    }
    updateLastActivity(context) {
        context.metadata.lastActivityAt = new Date();
    }
};
exports.ConversationStateService = ConversationStateService;
exports.ConversationStateService = ConversationStateService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, logger_decorator_1.InjectLogger)()),
    __metadata("design:paramtypes", [common_1.Logger])
], ConversationStateService);
//# sourceMappingURL=conversation-state.service.js.map