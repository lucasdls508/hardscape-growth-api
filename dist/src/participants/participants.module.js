"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParticipantsModule = void 0;
const common_1 = require("@nestjs/common");
const participants_controller_1 = require("./participants.controller");
const participants_service_1 = require("./participants.service");
const typeorm_1 = require("@nestjs/typeorm");
const participants_entity_1 = require("./entities/participants.entity");
let ParticipantsModule = class ParticipantsModule {
};
exports.ParticipantsModule = ParticipantsModule;
exports.ParticipantsModule = ParticipantsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([participants_entity_1.ConversationParticipant])],
        controllers: [participants_controller_1.ParticipantsController],
        providers: [participants_service_1.ParticipantsService],
        exports: [participants_service_1.ParticipantsService],
    })
], ParticipantsModule);
//# sourceMappingURL=participants.module.js.map