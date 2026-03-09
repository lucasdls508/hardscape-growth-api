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
exports.Messages = exports.MessageDirection = void 0;
const swagger_1 = require("@nestjs/swagger");
const attachments_entity_1 = require("../../attachment/entiies/attachments.entity");
const conversations_entity_1 = require("../../conversations/entities/conversations.entity");
const user_entity_1 = require("../../user/entities/user.entity");
const typeorm_1 = require("typeorm");
var MessageDirection;
(function (MessageDirection) {
    MessageDirection["OUTBOUND"] = "OUTBOUND";
    MessageDirection["INBOUND"] = "INBOUND";
})(MessageDirection || (exports.MessageDirection = MessageDirection = {}));
let Messages = class Messages {
};
exports.Messages = Messages;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: "Unique ID for the message" }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Messages.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "uuid-of-user", description: "User ID of sender" }),
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ type: "uuid", nullable: true }),
    __metadata("design:type", String)
], Messages.prototype, "sender_id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: MessageDirection,
    }),
    __metadata("design:type", String)
], Messages.prototype, "direction", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "sender_id" }),
    __metadata("design:type", user_entity_1.User)
], Messages.prototype, "sender_user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "1", description: "Converstaion Id" }),
    (0, typeorm_1.Column)({ nullable: true, unique: false }),
    __metadata("design:type", Number)
], Messages.prototype, "conversation_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
    __metadata("design:type", String)
], Messages.prototype, "sender_phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Hello!", description: "Message text" }),
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], Messages.prototype, "msg", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Text", description: "Text | Image | Offer" }),
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], Messages.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Conversation this message belongs to" }),
    (0, typeorm_1.ManyToOne)(() => conversations_entity_1.Conversations, (conversation) => conversation.messages, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "conversation_id" }),
    __metadata("design:type", conversations_entity_1.Conversations)
], Messages.prototype, "conversation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => [attachments_entity_1.MessageAttachment], description: "Message attachments" }),
    (0, typeorm_1.OneToMany)(() => attachments_entity_1.MessageAttachment, (attachment) => attachment.message, { cascade: true }),
    __metadata("design:type", Array)
], Messages.prototype, "attachments", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Boolean, description: "Message Seen", example: "true" }),
    (0, typeorm_1.Column)(),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Boolean)
], Messages.prototype, "isRead", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "timestamp with time zone" }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Date)
], Messages.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: "timestamp with time zone" }),
    __metadata("design:type", Date)
], Messages.prototype, "updated_at", void 0);
exports.Messages = Messages = __decorate([
    (0, typeorm_1.Entity)("messages"),
    (0, typeorm_1.Index)(["conversation_id", "created_at"])
], Messages);
//# sourceMappingURL=messages.entity.js.map