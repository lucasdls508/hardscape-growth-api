import { Logger } from "@nestjs/common";
import { ClientContext, ConversationStatus, FieldStatus, FormField, FormFieldClientContext, MetaBuisnessProfiles, RawMessageClientContext } from "../types/chatbot.types";
export declare class ConversationStateService {
    private readonly _logger;
    constructor(_logger: Logger);
    private createMetadata;
    private createBaseContext;
    initializeFormContext(clientId: string, formData: FormField[], userInfo: MetaBuisnessProfiles): Promise<FormFieldClientContext>;
    initializeRawContext(clientId: string, userInfo: MetaBuisnessProfiles): Promise<RawMessageClientContext>;
    determineNextStatus(context: ClientContext): Promise<ConversationStatus>;
    getRequiredFieldsStatus(context: ClientContext): FieldStatus;
    areAllFieldsCollected(context: ClientContext): boolean;
    getRemainingFields(context: ClientContext): FormField[];
    getNextMissingField(context: ClientContext): FormField | null;
    markFieldCollected(context: ClientContext, fieldName: string, value: string): void;
    resetContext(context: ClientContext): void;
    updateLastActivity(context: ClientContext): void;
}
