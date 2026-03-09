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
exports.AgencyProfile = void 0;
const swagger_1 = require("@nestjs/swagger");
const lead_entity_1 = require("../../leads_info/entities/lead.entity");
const meta_buisness_entity_1 = require("../../page_session/entites/meta_buisness.entity");
const user_entity_1 = require("../../user/entities/user.entity");
const typeorm_1 = require("typeorm");
let AgencyProfile = class AgencyProfile {
};
exports.AgencyProfile = AgencyProfile;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    (0, swagger_1.ApiProperty)({ description: "Unique ID for the agency profile" }),
    __metadata("design:type", String)
], AgencyProfile.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
    (0, swagger_1.ApiProperty)({ example: "page_123", description: "Business Profile Page ID (Foreign Key)" }),
    __metadata("design:type", String)
], AgencyProfile.prototype, "page_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    (0, swagger_1.ApiProperty)({
        example: "550e8400-e29b-41d4-a716-446655440000",
        description: "Agency Owner User ID (Foreign Key)",
    }),
    __metadata("design:type", String)
], AgencyProfile.prototype, "agency_owner_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255 }),
    (0, swagger_1.ApiProperty)({ example: "Tech Agency", description: "Agency Name" }),
    __metadata("design:type", String)
], AgencyProfile.prototype, "agency_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    (0, swagger_1.ApiProperty)({ example: "We provide tech solutions", description: "Agency Description" }),
    __metadata("design:type", String)
], AgencyProfile.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
    (0, swagger_1.ApiProperty)({ example: "https://example.com", description: "Agency Website URL" }),
    __metadata("design:type", String)
], AgencyProfile.prototype, "website", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
    (0, swagger_1.ApiProperty)({ example: "john@agency.com", description: "Agency Contact Email" }),
    __metadata("design:type", String)
], AgencyProfile.prototype, "contact_email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
    (0, swagger_1.ApiProperty)({ example: "john@agency.com", description: "Agency Contact Email" }),
    __metadata("design:type", String)
], AgencyProfile.prototype, "facebook_page_link", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
    (0, swagger_1.ApiProperty)({ example: "145456465456", description: "EIN" }),
    __metadata("design:type", String)
], AgencyProfile.prototype, "ein", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
    (0, swagger_1.ApiProperty)({ example: "145456465456", description: "National Identity Number" }),
    __metadata("design:type", String)
], AgencyProfile.prototype, "nid_no", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
    (0, swagger_1.ApiProperty)({ example: "145456465456", description: "National Id front picture" }),
    __metadata("design:type", String)
], AgencyProfile.prototype, "nid_front", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
    (0, swagger_1.ApiProperty)({ example: "145456465456", description: "National Id back picture" }),
    __metadata("design:type", String)
], AgencyProfile.prototype, "nid_back", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
    (0, swagger_1.ApiProperty)({ example: "145456465456", description: "Tax Id No" }),
    __metadata("design:type", String)
], AgencyProfile.prototype, "tax_no", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
    (0, swagger_1.ApiProperty)({ example: "tax-font.jpg", description: "Image" }),
    __metadata("design:type", String)
], AgencyProfile.prototype, "tax_id_front", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
    (0, swagger_1.ApiProperty)({ example: "tax-back.jpg", description: "Image" }),
    __metadata("design:type", String)
], AgencyProfile.prototype, "tax_id_back", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
    (0, swagger_1.ApiProperty)({ example: "+1234567890", description: "Agency Contact Phone" }),
    __metadata("design:type", String)
], AgencyProfile.prototype, "contact_phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
    (0, swagger_1.ApiProperty)({ example: "https://logo.png", description: "Agency Logo URL" }),
    __metadata("design:type", String)
], AgencyProfile.prototype, "logo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
    (0, swagger_1.ApiProperty)({ example: "123 Main St, City", description: "Agency Address" }),
    __metadata("design:type", String)
], AgencyProfile.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
    (0, swagger_1.ApiProperty)({ example: "Active", description: "Agency Status" }),
    __metadata("design:type", String)
], AgencyProfile.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", default: true }),
    (0, swagger_1.ApiProperty)({ example: true, description: "Is Agency Active" }),
    __metadata("design:type", Boolean)
], AgencyProfile.prototype, "is_active", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => meta_buisness_entity_1.MetaBuisnessProfiles, (profile) => profile.agency_profile, {
        onDelete: "CASCADE",
    }),
    (0, typeorm_1.JoinColumn)({ name: "business_profile_id" }),
    __metadata("design:type", meta_buisness_entity_1.MetaBuisnessProfiles)
], AgencyProfile.prototype, "buisness_profile", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.agency_profiles, {
        onDelete: "CASCADE",
    }),
    (0, typeorm_1.JoinColumn)({ name: "agency_owner_id" }),
    __metadata("design:type", user_entity_1.User)
], AgencyProfile.prototype, "agency_owner", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => lead_entity_1.Lead, (lead) => lead.agency),
    __metadata("design:type", Array)
], AgencyProfile.prototype, "leads", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_entity_1.User, (user) => user.works_for_agency),
    __metadata("design:type", Array)
], AgencyProfile.prototype, "members", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "timestamp with time zone" }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], AgencyProfile.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: "timestamp with time zone" }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], AgencyProfile.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], AgencyProfile.prototype, "deletedAt", void 0);
exports.AgencyProfile = AgencyProfile = __decorate([
    (0, typeorm_1.Entity)("agency_profiles"),
    (0, typeorm_1.Index)(["page_id"]),
    (0, typeorm_1.Index)(["agency_owner_id"])
], AgencyProfile);
//# sourceMappingURL=agency_profiles.entity.js.map