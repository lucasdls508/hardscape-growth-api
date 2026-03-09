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
exports.User = exports.USER_STATUS = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const agency_profiles_entity_1 = require("../../agency_profiles/entities/agency_profiles.entity");
const estimates_entity_1 = require("../../estimates/entities/estimates.entity");
const lead_entity_1 = require("../../leads_info/entities/lead.entity");
const meta_buisness_entity_1 = require("../../page_session/entites/meta_buisness.entity");
const typeorm_1 = require("typeorm");
const role_enum_1 = require("../enums/role.enum");
const verification_entity_1 = require("./verification.entity");
var USER_STATUS;
(function (USER_STATUS) {
    USER_STATUS["VERIFIED"] = "verified";
    USER_STATUS["NOT_VERIFIED"] = "not_verified";
})(USER_STATUS || (exports.USER_STATUS = USER_STATUS = {}));
let User = class User {
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50 }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], User.prototype, "first_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50 }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], User.prototype, "last_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], User.prototype, "image", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: true, default: USER_STATUS.NOT_VERIFIED }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], User.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, select: false }),
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: "varchar" }),
    __metadata("design:type", String)
], User.prototype, "fcm", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: "varchar" }),
    __metadata("design:type", String)
], User.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, select: false }),
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", String)
], User.prototype, "current_refresh_token", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: role_enum_1.UserRoles,
        array: true,
        default: [role_enum_1.UserRoles.AGENCY_OWNER],
    }),
    __metadata("design:type", Array)
], User.prototype, "roles", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", default: false }),
    (0, swagger_1.ApiProperty)({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "is_active", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => meta_buisness_entity_1.MetaBuisnessProfiles, (profile) => profile.users, {
        nullable: true,
        onDelete: "SET NULL",
    }),
    (0, typeorm_1.JoinColumn)({ name: "business_profile_id" }),
    __metadata("design:type", meta_buisness_entity_1.MetaBuisnessProfiles)
], User.prototype, "buisness_profiles", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => agency_profiles_entity_1.AgencyProfile, (agency) => agency.agency_owner),
    __metadata("design:type", Array)
], User.prototype, "agency_profiles", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => agency_profiles_entity_1.AgencyProfile, (agency) => agency.members),
    (0, typeorm_1.JoinColumn)({ name: "works_for_agency_id" }),
    __metadata("design:type", agency_profiles_entity_1.AgencyProfile)
], User.prototype, "works_for_agency", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => lead_entity_1.Lead, (lead) => lead.contructor_id),
    __metadata("design:type", Array)
], User.prototype, "leads", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => estimates_entity_1.Estimates, (estimate) => estimate.prepared_by_user),
    __metadata("design:type", Array)
], User.prototype, "estimates", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => verification_entity_1.Verification, (verification) => verification.user, {
        nullable: true,
        onDelete: "SET NULL",
    }),
    __metadata("design:type", verification_entity_1.Verification)
], User.prototype, "verification", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], User.prototype, "deletedAt", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)({ name: "users" })
], User);
//# sourceMappingURL=user.entity.js.map