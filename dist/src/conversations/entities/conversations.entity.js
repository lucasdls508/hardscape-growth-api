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
exports.Conversations = void 0;
const swagger_1 = require("@nestjs/swagger");
const lead_entity_1 = require("../../leads_info/entities/lead.entity");
const messages_entity_1 = require("../../messages/entities/messages.entity");
const participants_entity_1 = require("../../participants/entities/participants.entity");
const user_entity_1 = require("../../user/entities/user.entity");
const typeorm_1 = require("typeorm");
let Conversations = class Conversations {
};
exports.Conversations = Conversations;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: "Unique ID for the conversation" }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Conversations.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Last Message" }),
    (0, typeorm_1.Index)(),
    (0, typeorm_1.OneToOne)(() => messages_entity_1.Messages, { onDelete: "SET NULL", nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: "lastmsg_id" }),
    __metadata("design:type", messages_entity_1.Messages)
], Conversations.prototype, "lastmsg", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => [messages_entity_1.Messages], description: "Messages in the conversation" }),
    (0, typeorm_1.OneToMany)(() => messages_entity_1.Messages, (message) => message.conversation, { cascade: true }),
    __metadata("design:type", Array)
], Conversations.prototype, "messages", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => [user_entity_1.User], description: "Users participating in the conversation" }),
    (0, typeorm_1.OneToMany)(() => participants_entity_1.ConversationParticipant, (p) => p.conversation),
    __metadata("design:type", Array)
], Conversations.prototype, "participants", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => lead_entity_1.Lead, { onDelete: "SET NULL" }),
    (0, typeorm_1.JoinColumn)({ name: "lead_id" }),
    __metadata("design:type", lead_entity_1.Lead)
], Conversations.prototype, "lead", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ type: "varchar", length: 20, nullable: true }),
    __metadata("design:type", String)
], Conversations.prototype, "lead_phone", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ type: "varchar", length: 40, nullable: true }),
    __metadata("design:type", String)
], Conversations.prototype, "lead_email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Conversation creation timestamp" }),
    (0, typeorm_1.CreateDateColumn)({ type: "timestamp with time zone" }),
    __metadata("design:type", Date)
], Conversations.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Conversation update timestamp" }),
    (0, typeorm_1.UpdateDateColumn)({ type: "timestamp with time zone" }),
    __metadata("design:type", Date)
], Conversations.prototype, "updated_at", void 0);
exports.Conversations = Conversations = __decorate([
    (0, typeorm_1.Index)(["updated_at"]),
    (0, typeorm_1.Index)(["lead_phone", "updated_at"]),
    (0, typeorm_1.Entity)("conversations")
], Conversations);
//# sourceMappingURL=conversations.entity.js.map