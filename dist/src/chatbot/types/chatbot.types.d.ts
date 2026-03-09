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
    users?: {
        first_name: string;
        last_name: string;
        phone: string;
        email: string;
    };
}
export interface ConversationMetadata {
    startedAt: Date;
    lastActivityAt: Date;
    sourceChannel: "website" | "phone" | "email" | "chat" | "social" | string;
}
interface BaseClientContext {
    id: string;
    userInfo: MetaBuisnessProfiles;
    conversationHistory: Message[];
    status: ConversationStatus;
    collectedData: Map<string, string>;
    metadata: ConversationMetadata;
}
export interface FormFieldClientContext extends BaseClientContext {
    type: "form";
    formData: FormField[];
}
export interface RawMessageClientContext extends BaseClientContext {
    type: "raw";
    formData?: never;
}
export type ClientContext = FormFieldClientContext | RawMessageClientContext;
export declare const contextTypeGuards: {
    isFormContext(context: ClientContext): context is FormFieldClientContext;
    isRawContext(context: ClientContext): context is RawMessageClientContext;
    hasFormData(context: ClientContext): context is FormFieldClientContext;
    getFormData(context: ClientContext): FormField[] | null;
    assertFormContext(context: ClientContext): FormFieldClientContext;
};
export interface ChatResponse {
    message: string;
    nextAction: string;
    suggestedQuestions: string[];
    collectedFields: Map<string, string>;
}
export interface FieldStatus {
    total: number;
    collected: number;
    remaining: string[];
    progress: number;
}
export interface NormalizedClientUserInfo {
    first_name: string;
    last_name: string;
    buisness_category: string;
    buisness_name: string;
    phone: string;
    email: string;
}
export type FormFieldMessageClientContext = FormFieldClientContext;
export interface DynamicFormField {
    name: string;
    values: string[];
}
export {};
