import { ConfigService } from "@nestjs/config";
import { FormFieldMessageClientContext, RawMessageClientContext } from "src/chatbot/types/chatbot.types";
import { ChatbotUtilsService } from "src/chatbot/utils/chatbot.utils.service";
export declare class LangChainOpenAIService {
    private _configService;
    private _chatbotUtils;
    private client;
    private readonly MODEL;
    constructor(_configService: ConfigService, _chatbotUtils: ChatbotUtilsService);
    generateResponse(clientContext: RawMessageClientContext | FormFieldMessageClientContext, userMessage: string): Promise<string>;
    extractStructuredData(userMessage: string, formFields: {
        name: string;
        values: string[];
    }[]): Promise<Map<string, string>>;
    extractStructuredInformation(userMessage: string): Promise<Map<string, string>>;
    extractAppointmentDateTime(sophiaResponse: string): Promise<{
        start_time: string;
        end_time: string;
    } | null>;
    testConnection(): Promise<boolean>;
    private _getLeadName;
    private _getMissingFields;
    private _formatCollectedData;
    private _buildHistory;
    private _parseJson;
}
