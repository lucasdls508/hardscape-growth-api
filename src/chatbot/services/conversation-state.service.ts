import { Injectable, Logger } from "@nestjs/common";
import { InjectLogger } from "src/shared/decorators/logger.decorator";
import {
  ClientContext,
  ConversationMetadata,
  ConversationStatus,
  FieldStatus,
  FormField,
  FormFieldClientContext,
  MetaBuisnessProfiles,
  RawMessageClientContext,
} from "../types/chatbot.types";

@Injectable()
export class ConversationStateService {
  constructor(@InjectLogger() private readonly _logger: Logger) {}

  /**
   * Create base metadata
   */
  private createMetadata(): ConversationMetadata {
    return {
      startedAt: new Date(),
      lastActivityAt: new Date(),
      sourceChannel: "chat",
    };
  }

  /**
   * Create base context - shared initialization
   */
  private createBaseContext(clientId: string, userInfo: MetaBuisnessProfiles) {
    return {
      id: clientId,
      userInfo,
      conversationHistory: [],
      status: "greeting" as ConversationStatus,
      collectedData: new Map<string, string>(),
      metadata: this.createMetadata(),
    };
  }

  /**
   * Initialize form context
   */
  async initializeFormContext(
    clientId: string,
    formData: FormField[],
    userInfo: MetaBuisnessProfiles
  ): Promise<FormFieldClientContext> {
    const context: FormFieldClientContext = {
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

  /**
   * Initialize raw context
   */
  async initializeRawContext(
    clientId: string,
    userInfo: MetaBuisnessProfiles
  ): Promise<RawMessageClientContext> {
    try {
      const context: RawMessageClientContext = {
        ...this.createBaseContext(clientId, userInfo),
        type: "raw",
      };

      this._logger.log("Raw context initialized", { clientId });
      console.log("raw context");
      return context;
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Determine next conversation status
   */
  async determineNextStatus(context: ClientContext): Promise<ConversationStatus> {
    if (context.type === "form") {
      const fieldStatus = this.getRequiredFieldsStatus(context);
      if (fieldStatus.remaining.length === 0) {
        return "appointment_scheduling";
      } else if (context.conversationHistory.length > 2) {
        return "information_gathering";
      }
    } else {
      // Raw context uses message count
      const messageCount = context.conversationHistory.length;
      if (messageCount < 3) return "greeting";
      if (messageCount < 6) return "information_gathering";
      return "appointment_scheduling";
    }

    return context.status;
  }

  /**
   * Get field completion status - ONLY works with form context
   */
  getRequiredFieldsStatus(context: ClientContext): FieldStatus {
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

  /**
   * Check if all required fields are collected
   */
  areAllFieldsCollected(context: ClientContext): boolean {
    if (context.type !== "form") return true;
    return context.formData.every((field) => context.collectedData.has(field.name));
  }

  /**
   * Get remaining fields in order
   */
  getRemainingFields(context: ClientContext): FormField[] {
    if (context.type !== "form") return [];
    return context.formData.filter((field) => !context.collectedData.has(field.name));
  }

  /**
   * Get next missing field
   */
  getNextMissingField(context: ClientContext): FormField | null {
    const remaining = this.getRemainingFields(context);
    return remaining.length > 0 ? remaining[0] : null;
  }

  /**
   * Mark field as collected
   */
  markFieldCollected(context: ClientContext, fieldName: string, value: string): void {
    context.collectedData.set(fieldName, value);
    this._logger.debug("Field collected", { fieldName, clientId: context.id });
  }

  /**
   * Reset context to initial state
   */
  resetContext(context: ClientContext): void {
    context.conversationHistory = [];
    context.collectedData.clear();
    context.status = "greeting";
    context.metadata.lastActivityAt = new Date();
    this._logger.log("Context reset", { clientId: context.id });
  }

  /**
   * Update last activity timestamp
   */
  updateLastActivity(context: ClientContext): void {
    context.metadata.lastActivityAt = new Date();
  }
}
