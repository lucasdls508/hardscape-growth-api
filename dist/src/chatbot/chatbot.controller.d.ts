import { MetaBuisnessProfiles } from "src/page_session/entites/meta_buisness.entity";
import { ChatbotService } from "./chatbot.service";
import { ChatRequestDto } from "./dto/ChatRequest.dto";
export declare class ChatbotController {
    private readonly _chatbotService;
    constructor(_chatbotService: ChatbotService);
    handleChat(chatRequest: ChatRequestDto): Promise<import("./types/chatbot.types").ChatResponse>;
    handleRawMessaging(chatRequest: any, userInfo: MetaBuisnessProfiles): Promise<import("./types/chatbot.types").ChatResponse>;
}
