"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookModule = void 0;
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const auth_module_1 = require("../auth/auth.module");
const chatbot_module_1 = require("../chatbot/chatbot.module");
const estimates_module_1 = require("../estimates/estimates.module");
const notifications_module_1 = require("../notifications/notifications.module");
const page_session_module_1 = require("../page_session/page_session.module");
const user_module_1 = require("../user/user.module");
const webhook_controller_1 = require("./webhook.controller");
const webhook_service_1 = require("./webhook.service");
let WebhookModule = class WebhookModule {
};
exports.WebhookModule = WebhookModule;
exports.WebhookModule = WebhookModule = __decorate([
    (0, common_1.Module)({
        imports: [
            user_module_1.UserModule,
            auth_module_1.AuthModule,
            page_session_module_1.PageSessionModule,
            bull_1.BullModule.registerQueue({ name: "uploadQueue" }, { name: "leads" }),
            chatbot_module_1.ChatbotModule,
            estimates_module_1.EstimatesModule,
            notifications_module_1.NotificationsModule,
        ],
        controllers: [webhook_controller_1.WebhookController],
        providers: [webhook_service_1.WebhookService],
        exports: [webhook_service_1.WebhookService],
    })
], WebhookModule);
//# sourceMappingURL=webhook.module.js.map