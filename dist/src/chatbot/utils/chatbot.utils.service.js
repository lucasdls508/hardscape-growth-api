"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatbotUtilsService = void 0;
const common_1 = require("@nestjs/common");
let ChatbotUtilsService = class ChatbotUtilsService {
    extractClientUserInfo(context) {
        const user = context.userInfo;
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
        return {
            first_name: user.first_name,
            last_name: user.last_name,
            buisness_category: user.buisness_category,
            buisness_name: user.buisness_name,
            phone: user.phone,
            email: user.email,
        };
    }
    getFullName(context) {
        const info = this.extractClientUserInfo(context);
        return `${info.first_name} ${info.last_name}`;
    }
    getBusinessInfo(context) {
        const info = this.extractClientUserInfo(context);
        return {
            name: info.buisness_name,
            category: info.buisness_category,
        };
    }
    getContactInfo(context) {
        const info = this.extractClientUserInfo(context);
        return {
            email: info.email,
            phone: info.phone,
        };
    }
};
exports.ChatbotUtilsService = ChatbotUtilsService;
exports.ChatbotUtilsService = ChatbotUtilsService = __decorate([
    (0, common_1.Injectable)()
], ChatbotUtilsService);
//# sourceMappingURL=chatbot.utils.service.js.map