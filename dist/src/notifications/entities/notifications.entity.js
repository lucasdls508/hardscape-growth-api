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
exports.Notifications = exports.NotificationAction = exports.NotificationType = exports.NotificationRelated = void 0;
const swagger_1 = require("@nestjs/swagger");
const user_entity_1 = require("../../user/entities/user.entity");
const typeorm_1 = require("typeorm");
var NotificationRelated;
(function (NotificationRelated) {
    NotificationRelated["PRODUCT"] = "product";
    NotificationRelated["ORDER"] = "order";
    NotificationRelated["CONVERSATION"] = "conversation";
    NotificationRelated["WALLET"] = "wallet";
    NotificationRelated["LEAD"] = "lead";
    NotificationRelated["APPOINTMENT"] = "appointment";
    NotificationRelated["ESTIMATE"] = "estimate";
})(NotificationRelated || (exports.NotificationRelated = NotificationRelated = {}));
var NotificationType;
(function (NotificationType) {
    NotificationType["INFO"] = "info";
    NotificationType["SUCCESS"] = "success";
    NotificationType["ERROR"] = "error";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
var NotificationAction;
(function (NotificationAction) {
    NotificationAction["CREATED"] = "created";
    NotificationAction["UPDATED"] = "updated";
    NotificationAction["DELETED"] = "deleted";
})(NotificationAction || (exports.NotificationAction = NotificationAction = {}));
let Notifications = class Notifications {
};
exports.Notifications = Notifications;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: "Unique ID for the notification" }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Notifications.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "recepient_id" }),
    __metadata("design:type", user_entity_1.User)
], Notifications.prototype, "recepient", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "actor_id" }),
    __metadata("design:type", user_entity_1.User)
], Notifications.prototype, "actor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Product Created", description: "Notification title or brief message" }),
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], Notifications.prototype, "msg", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Product Created", description: "Notification title or brief message" }),
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], Notifications.prototype, "notificationFor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "The type of entity this notification is related to" }),
    (0, typeorm_1.Column)({
        type: "enum",
        enum: NotificationRelated,
    }),
    __metadata("design:type", String)
], Notifications.prototype, "related", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Action that triggered the notification" }),
    (0, typeorm_1.Column)({
        type: "enum",
        enum: NotificationAction,
    }),
    __metadata("design:type", String)
], Notifications.prototype, "action", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "success", description: "Notification type (info, success, error)" }),
    (0, typeorm_1.Column)({
        type: "enum",
        enum: NotificationType,
        default: NotificationType.INFO,
    }),
    __metadata("design:type", String)
], Notifications.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "The entity related to the notification (product, order, etc.)" }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Notifications.prototype, "target_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Notifications.prototype, "isRead", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Notifications.prototype, "isImportant", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "timestamp with time zone" }),
    __metadata("design:type", Date)
], Notifications.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: "timestamp with time zone" }),
    __metadata("design:type", Date)
], Notifications.prototype, "updated_at", void 0);
exports.Notifications = Notifications = __decorate([
    (0, typeorm_1.Entity)("notifications")
], Notifications);
//# sourceMappingURL=notifications.entity.js.map