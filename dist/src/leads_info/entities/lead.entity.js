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
exports.Lead = void 0;
const conversations_entity_1 = require("../../conversations/entities/conversations.entity");
const estimates_entity_1 = require("../../estimates/entities/estimates.entity");
const user_entity_1 = require("../../user/entities/user.entity");
const typeorm_1 = require("typeorm");
const lead_status_enum_1 = require("../enums/lead_status.enum");
let Lead = class Lead {
};
exports.Lead = Lead;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Lead.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "meta_lead_id", type: "varchar", nullable: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], Lead.prototype, "meta_lead_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "messenger_psid", type: "varchar", nullable: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], Lead.prototype, "messenger_psid", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "agency_id", type: "uuid", nullable: true }),
    __metadata("design:type", String)
], Lead.prototype, "agency_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (agency) => agency.leads, {
        nullable: true,
        onDelete: "SET NULL",
    }),
    (0, typeorm_1.JoinColumn)({ name: "agency_id" }),
    __metadata("design:type", user_entity_1.User)
], Lead.prototype, "agency", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "contructor_id", type: "uuid", nullable: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], Lead.prototype, "contructor_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.leads),
    (0, typeorm_1.JoinColumn)({ name: "contructor_id" }),
    __metadata("design:type", user_entity_1.User)
], Lead.prototype, "contructor", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => conversations_entity_1.Conversations, (conversation) => conversation.lead),
    __metadata("design:type", conversations_entity_1.Conversations)
], Lead.prototype, "conversation", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => estimates_entity_1.Estimates, (estimate) => estimate.lead),
    __metadata("design:type", Array)
], Lead.prototype, "estimates", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: lead_status_enum_1.LeadStatus,
        default: lead_status_enum_1.LeadStatus.NEW,
    }),
    __metadata("design:type", String)
], Lead.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: true }),
    __metadata("design:type", String)
], Lead.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: true }),
    __metadata("design:type", String)
], Lead.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 50, nullable: true }),
    __metadata("design:type", String)
], Lead.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
    __metadata("design:type", String)
], Lead.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "form_id", type: "varchar", nullable: true }),
    __metadata("design:type", String)
], Lead.prototype, "form_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "form_info", type: "json", nullable: true }),
    __metadata("design:type", Object)
], Lead.prototype, "form_info", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
    __metadata("design:type", String)
], Lead.prototype, "project_details", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "start_time_preference",
        type: "text",
        nullable: true,
    }),
    __metadata("design:type", String)
], Lead.prototype, "start_time_pref", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "is_used", type: "boolean", default: false }),
    __metadata("design:type", Boolean)
], Lead.prototype, "is_used", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at", type: "timestamp" }),
    __metadata("design:type", Date)
], Lead.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ name: "deleted_at", type: "timestamp" }),
    __metadata("design:type", Date)
], Lead.prototype, "deleted_at", void 0);
exports.Lead = Lead = __decorate([
    (0, typeorm_1.Entity)({ name: "leads" }),
    (0, typeorm_1.Index)(["status", "is_used"]),
    (0, typeorm_1.Index)("IDX_LEADS_STATUS", ["status"])
], Lead);
//# sourceMappingURL=lead.entity.js.map