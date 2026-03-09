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
exports.MessageAttachment = void 0;
const messages_entity_1 = require("../../messages/entities/messages.entity");
const typeorm_1 = require("typeorm");
let MessageAttachment = class MessageAttachment {
};
exports.MessageAttachment = MessageAttachment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], MessageAttachment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => messages_entity_1.Messages, (message) => message.attachments, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "message_id" }),
    __metadata("design:type", messages_entity_1.Messages)
], MessageAttachment.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar" }),
    __metadata("design:type", String)
], MessageAttachment.prototype, "file_url", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
    __metadata("design:type", String)
], MessageAttachment.prototype, "file_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
    __metadata("design:type", String)
], MessageAttachment.prototype, "file_name", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "timestamp with time zone" }),
    __metadata("design:type", Date)
], MessageAttachment.prototype, "uploaded_at", void 0);
exports.MessageAttachment = MessageAttachment = __decorate([
    (0, typeorm_1.Entity)("message_attachments")
], MessageAttachment);
//# sourceMappingURL=attachments.entity.js.map