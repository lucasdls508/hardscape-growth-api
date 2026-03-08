/**
 * Refactored Chatbot Types - DRY & Type-Safe
 *
 * Key improvements:
 * 1. Proper discriminated unions for context types
 * 2. Type guards that work correctly across all files
 * 3. Generics for metadata to avoid duplication
 * 4. Safe extraction utilities
 */

export type ConversationStatus = "greeting" | "information_gathering" | "appointment_scheduling" | "closing";

export interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface FormField {
  name: string;
  values: string[];
}

export interface MetaBuisnessProfiles {
  id: string;
  buisness_name: string;
  buisness_category: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  // Form-based variant
  users?: {
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
  };
}

/**
 * Metadata - shared across all context types
 */
export interface ConversationMetadata {
  startedAt: Date;
  lastActivityAt: Date;
  sourceChannel: "website" | "phone" | "email" | "chat" | "social" | string;
}

/**
 * Base context interface - common fields
 */
interface BaseClientContext {
  id: string;
  userInfo: MetaBuisnessProfiles;
  conversationHistory: Message[];
  status: ConversationStatus;
  collectedData: Map<string, string>;
  metadata: ConversationMetadata;
}

/**
 * Form-based context - has formData
 */
export interface FormFieldClientContext extends BaseClientContext {
  type: "form";
  formData: FormField[];
}

/**
 * Raw context - no formData
 */
export interface RawMessageClientContext extends BaseClientContext {
  type: "raw";
  formData?: never;
}

/**
 * Union type for all contexts
 */
export type ClientContext = FormFieldClientContext | RawMessageClientContext;

/**
 * Type-safe guards with proper narrowing
 */
export const contextTypeGuards = {
  isFormContext(context: ClientContext): context is FormFieldClientContext {
    return context.type === "form";
  },

  isRawContext(context: ClientContext): context is RawMessageClientContext {
    return context.type === "raw";
  },

  hasFormData(context: ClientContext): context is FormFieldClientContext {
    return context.type === "form" && Array.isArray(context.formData) && context.formData.length > 0;
  },

  getFormData(context: ClientContext): FormField[] | null {
    return context.type === "form" ? context.formData : null;
  },

  /**
   * Assert that context is FormFieldClientContext, throw if not
   */
  assertFormContext(context: ClientContext): FormFieldClientContext {
    if (!contextTypeGuards.isFormContext(context)) {
      throw new Error("Context is not a form context");
    }
    return context;
  },
};

/**
 * Response types
 */
export interface ChatResponse {
  message: string;
  nextAction: string;
  suggestedQuestions: string[];
  collectedFields: Map<string, string>;
}

/**
 * Field status for tracking form completion
 */
export interface FieldStatus {
  total: number;
  collected: number;
  remaining: string[];
  progress: number;
}

/**
 * Normalized user info for consistent access
 */
export interface NormalizedClientUserInfo {
  first_name: string;
  last_name: string;
  buisness_category: string;
  buisness_name: string;
  phone: string;
  email: string;
}

/**
 * Alternative name for FormFieldClientContext (for backwards compatibility)
 */
export type FormFieldMessageClientContext = FormFieldClientContext;

/**
 * Dynamic form field for extraction
 */
export interface DynamicFormField {
  name: string;
  values: string[];
}
