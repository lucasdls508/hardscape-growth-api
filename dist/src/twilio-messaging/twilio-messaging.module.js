"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwilioMessagingModule = void 0;
const common_1 = require("@nestjs/common");
const twilio_messaging_controller_1 = require("./twilio-messaging.controller");
const twilio_messaging_service_1 = require("./twilio-messaging.service");
let TwilioMessagingModule = class TwilioMessagingModule {
};
exports.TwilioMessagingModule = TwilioMessagingModule;
exports.TwilioMessagingModule = TwilioMessagingModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [twilio_messaging_service_1.TwilioMessagingService],
        controllers: [twilio_messaging_controller_1.TwilioMessagingController],
        exports: [twilio_messaging_service_1.TwilioMessagingService],
    })
], TwilioMessagingModule);
//# sourceMappingURL=twilio-messaging.module.js.map