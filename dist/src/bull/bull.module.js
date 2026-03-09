"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BullModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const agency_profiles_module_1 = require("../agency_profiles/agency_profiles.module");
const chatbot_module_1 = require("../chatbot/chatbot.module");
const conversations_module_1 = require("../conversations/conversations.module");
const firebase_module_1 = require("../firebase/firebase.module");
const leads_info_module_1 = require("../leads_info/leads_info.module");
const mail_module_1 = require("../mail/mail.module");
const messages_module_1 = require("../messages/messages.module");
const notifications_module_1 = require("../notifications/notifications.module");
const otp_module_1 = require("../otp/otp.module");
const twilio_messaging_module_1 = require("../twilio-messaging/twilio-messaging.module");
const user_entity_1 = require("../user/entities/user.entity");
const verification_entity_1 = require("../user/entities/verification.entity");
const user_module_1 = require("../user/user.module");
const bull_controller_1 = require("./bull.controller");
const bull_service_1 = require("./bull.service");
const AuthenticationQueue_1 = require("./processors/AuthenticationQueue");
let BullModule = class BullModule {
};
exports.BullModule = BullModule;
exports.BullModule = BullModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, verification_entity_1.Verification]),
            mail_module_1.MailModule,
            firebase_module_1.FirebaseModule,
            notifications_module_1.NotificationsModule,
            user_module_1.UserModule,
            otp_module_1.OtpModule,
            user_module_1.UserModule,
            leads_info_module_1.LeadsInfoModule,
            agency_profiles_module_1.AgencyProfilesModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => {
                    return {
                        secret: configService.get("JWT_SECRET"),
                        signOptions: {
                            expiresIn: configService.get("EXPIRES_IN"),
                        },
                    };
                },
            }),
            conversations_module_1.ConversationsModule,
            messages_module_1.MessagesModule,
            chatbot_module_1.ChatbotModule,
            messages_module_1.MessagesModule,
            twilio_messaging_module_1.TwilioMessagingModule,
        ],
        providers: [bull_service_1.BullService, AuthenticationQueue_1.AuthQueueProcessor],
        controllers: [bull_controller_1.BullController],
    })
], BullModule);
//# sourceMappingURL=bull.module.js.map