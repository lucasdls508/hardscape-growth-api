import { ClientContext, NormalizedClientUserInfo } from "../types/chatbot.types";
export declare class ChatbotUtilsService {
    extractClientUserInfo(context: ClientContext): NormalizedClientUserInfo;
    getFullName(context: ClientContext): string;
    getBusinessInfo(context: ClientContext): {
        name: string;
        category: string;
    };
    getContactInfo(context: ClientContext): {
        email: string;
        phone: string;
    };
}
