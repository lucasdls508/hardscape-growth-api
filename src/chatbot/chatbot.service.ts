import { Injectable, Logger } from "@nestjs/common";
import { LangChainOpenAIService } from "src/lang-chain-open-ai/lang-chain-open-ai.service";
// import { clientInfo } from "src/main";
import { MetaBuisnessProfiles } from "src/page_session/entites/meta_buisness.entity";
import { InjectLogger } from "src/shared/decorators/logger.decorator";
import { ConversationMemoryService } from "./services/chat-conversation.service";
import { ConversationStateService } from "./services/conversation-state.service";
import { ChatResponse, ClientContext, contextTypeGuards, FormField, Message } from "./types/chatbot.types";
import { ChatbotUtilsService } from "./utils/chatbot.utils.service";

/**
 * Abstract LLM service interface
 * Allows switching between different LLM providers (OpenAI, Ollama, etc.)
 */

@Injectable()
export class ChatbotService {
  clientInfo;

  constructor(
    private _langchain: LangChainOpenAIService, // Abstracted LLM service
    private _memoryService: ConversationMemoryService,
    private _stateService: ConversationStateService,
    private _chatbotUtils: ChatbotUtilsService,
    @InjectLogger() private readonly _logger: Logger
  ) {
    // this.clientInfo = clientInfo;
  }

  /**
   * Handle chat with form fields
   * Use this when you have pre-defined form structure
   */
  async chatWithForm(
    clientId: string,
    userMessage: string,
    formData: FormField[],
    userInfo: MetaBuisnessProfiles
  ): Promise<ChatResponse> {
    try {
      let context = await this._memoryService.getClientContext(clientId);

      if (!context || !contextTypeGuards.isFormContext(context)) {
        context = await this._stateService.initializeFormContext(clientId, formData, userInfo as any);
      }

      await this._processMessage(context, userMessage);
      return this._formatResponse(context);
    } catch (error) {
      this._logger.error("Form chat error", { clientId, userMessage, error });
      throw new Error("Failed to process chat message");
    }
  }

  /**
   * Handle raw conversation (no form fields)
   * Use this for free-form conversations
   */
  async chatRaw(
    clientId: string,
    userMessage: string,
    userInfo: MetaBuisnessProfiles
  ): Promise<ChatResponse> {
    try {
      let context = await this._memoryService.getClientContext(clientId);

      if (!context || !contextTypeGuards.isRawContext(context)) {
        context = await this._stateService.initializeRawContext(clientId, userInfo as any);
      }
      console.log(context);
      await this._processMessage(context, userMessage);
      return this._formatResponse(context);
    } catch (error) {
      this._logger.log("Raw chat error", { clientId, userMessage, error });
      throw new Error("Failed to process chat message");
    }
  }

  /**
   * Process message - works for both context types
   */
  private async _processMessage(context: ClientContext, userMessage: string): Promise<void> {
    // Save user message
    const userMsg: Message = {
      role: "user",
      content: userMessage,
      timestamp: new Date(),
    };

    await this._memoryService.saveMessage(context.id, userMsg);
    context.conversationHistory.push(userMsg);

    // Extract structured data based on context type
    if (contextTypeGuards.isFormContext(context)) {
      const extractedData = await this._langchain.extractStructuredData(userMessage, context.formData);

      extractedData.forEach((value, key) => {
        context.collectedData.set(key, value);
      });
    } else {
      const extractedData = await this._langchain.extractStructuredInformation(userMessage);

      extractedData.forEach((value, key) => {
        context.collectedData.set(key, value);
      });
    }

    // Determine next status
    context.status = await this._stateService.determineNextStatus(context);

    // Generate AI response
    const aiResponse = await this._langchain.generateResponse(context, userMessage);

    // Save assistant message
    const assistantMsg: Message = {
      role: "assistant",
      content: aiResponse,
      timestamp: new Date(),
    };

    await this._memoryService.saveMessage(context.id, assistantMsg);
    context.conversationHistory.push(assistantMsg);

    // Persist context
    await this._memoryService.saveClientContext(context.id, context);

    // Update last activity
    this._stateService.updateLastActivity(context);
  }

  /**
   * Format response
   */
  private _formatResponse(context: ClientContext): ChatResponse {
    return {
      message: context.conversationHistory[context.conversationHistory.length - 1]?.content || "",
      nextAction: this._getNextAction(context.status),
      suggestedQuestions: this._generateSuggestedQuestions(context),
      collectedFields: context.collectedData,
    };
  }

  /**
   * Generate suggested questions based on status
   */
  private _generateSuggestedQuestions(context: ClientContext): string[] {
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

  /**
   * Greeting phase questions
   */
  private _generateGreetingQuestions(): string[] {
    return ["Tell me about your project", "What are your main challenges?", "What brings you here today?"];
  }

  /**
   * Information gathering questions
   */
  private _generateInfoGatheringQuestions(context: ClientContext): string[] {
    const questions: string[] = [];

    if (contextTypeGuards.isFormContext(context)) {
      const fieldStatus = this._stateService.getRequiredFieldsStatus(context);

      if (fieldStatus.remaining.length > 0) {
        const missingFieldName = fieldStatus.remaining[0];
        questions.push(this._generateFieldQuestion(missingFieldName));
        questions.push(this._generateFieldFollowup(missingFieldName));
      } else {
        questions.push("Is there anything else you'd like to add?");
      }
    } else {
      questions.push("Can you tell me more about yourself?");
      questions.push("What specific information do you need?");
    }

    return questions;
  }

  /**
   * Scheduling phase questions
   */
  private _generateSchedulingQuestions(): string[] {
    return [
      "When are you available for a call?",
      "Would you like to schedule a demo?",
      "What time works best for you?",
      "Can we schedule this week?",
    ];
  }

  /**
   * Closing phase questions
   */
  private _generateClosingQuestions(): string[] {
    return [
      "Is there anything else I can help with?",
      "Would you like to stay updated?",
      "Any final questions before we wrap up?",
    ];
  }

  /**
   * Generate contextual question for a field
   */
  private _generateFieldQuestion(fieldName: string): string {
    const questionMap: Record<string, string> = {
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

  /**
   * Generate follow-up response for a field
   */
  private _generateFieldFollowup(fieldName: string): string {
    const followupMap: Record<string, string> = {
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

  /**
   * Get action description based on status
   */
  private _getNextAction(status: string): string {
    const actions: Record<string, string> = {
      greeting: "Establish rapport and understand client needs",
      information_gathering: "Collect missing required information",
      appointment_scheduling: "Propose and confirm appointment/demo",
      closing: "Summarize and schedule follow-up",
    };

    return actions[status] || "Continue conversation";
  }

  /**
   * Get conversation history
   */
  async getConversationHistory(clientId: string): Promise<Message[]> {
    return this._memoryService.getConversationHistory(clientId);
  }

  /**
   * Get client context
   */
  async getClientContext(clientId: string): Promise<ClientContext | null> {
    return this._memoryService.getClientContext(clientId);
  }

  /**
   * Clear conversation
   */
  async clearConversation(clientId: string): Promise<void> {
    await this._memoryService.clearConversation(clientId);
    // this._langchain.
  }

  /**
   * Get session stats
   */
  async getSessionStats(clientId: string): Promise<any> {
    const context = await this._memoryService.getClientContext(clientId);
    if (!context) return null;

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

    // Add form-specific stats
    if (contextTypeGuards.isFormContext(context)) {
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
}
