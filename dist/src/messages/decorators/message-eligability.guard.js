"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageEligabilityGuard = void 0;
const common_1 = require("@nestjs/common");
const leads_info_service_1 = require("../../leads_info/leads_info.service");
const page_session_service_1 = require("../../page_session/page_session.service");
const participants_service_1 = require("../../participants/participants.service");
let MessageEligabilityGuard = class MessageEligabilityGuard {
    constructor(participantService, _pageSessionService, _leadService) {
        this.participantService = participantService;
        this._pageSessionService = _pageSessionService;
        this._leadService = _leadService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const params = request.body.conversation_id || request.params.id;
        const participants = await this.participantService.getParticipants(parseFloat(params));
        const eligable = true;
        request.receiver = participants;
        return eligable;
    }
};
exports.MessageEligabilityGuard = MessageEligabilityGuard;
exports.MessageEligabilityGuard = MessageEligabilityGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [participants_service_1.ParticipantsService,
        page_session_service_1.PageSessionService,
        leads_info_service_1.LeadsInfoService])
], MessageEligabilityGuard);
//# sourceMappingURL=message-eligability.guard.js.map