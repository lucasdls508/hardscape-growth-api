import { Injectable } from "@nestjs/common";
import { ClientContext, NormalizedClientUserInfo } from "../types/chatbot.types";

@Injectable()
export class ChatbotUtilsService {
  /**
   * Extract normalized user info from context
   * Handles both form and raw contexts
   */
  extractClientUserInfo(context: ClientContext): NormalizedClientUserInfo {
    const user = context.userInfo;

    // Check if it's the form-based variant (has users property)
    if ("users" in user && user.users) {
      return {
        first_name: user.users.first_name,
        last_name: user.users.last_name,
        buisness_category: user.buisness_category,
        buisness_name: user.buisness_name,
        phone: user.users.phone,
        email: user.users.email,
      };
    }

    // Standard variant
    return {
      first_name: user.first_name,
      last_name: user.last_name,
      buisness_category: user.buisness_category,
      buisness_name: user.buisness_name,
      phone: user.phone,
      email: user.email,
    };
  }

  /**
   * Get full name from context
   */
  getFullName(context: ClientContext): string {
    const info = this.extractClientUserInfo(context);
    return `${info.first_name} ${info.last_name}`;
  }

  /**
   * Get business info from context
   */
  getBusinessInfo(context: ClientContext) {
    const info = this.extractClientUserInfo(context);
    return {
      name: info.buisness_name,
      category: info.buisness_category,
    };
  }

  /**
   * Get contact info from context
   */
  getContactInfo(context: ClientContext) {
    const info = this.extractClientUserInfo(context);
    return {
      email: info.email,
      phone: info.phone,
    };
  }
}
