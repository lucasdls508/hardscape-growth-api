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
exports.MetaBuisnessProfiles = void 0;
const swagger_1 = require("@nestjs/swagger");
const agency_profiles_entity_1 = require("../../agency_profiles/entities/agency_profiles.entity");
const user_entity_1 = require("../../user/entities/user.entity");
const typeorm_1 = require("typeorm");
let MetaBuisnessProfiles = class MetaBuisnessProfiles {
};
exports.MetaBuisnessProfiles = MetaBuisnessProfiles;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: "Unique ID for the page session" }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], MetaBuisnessProfiles.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "page_id", description: "Page Id" }),
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ type: "varchar" }),
    __metadata("design:type", String)
], MetaBuisnessProfiles.prototype, "page_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Buisness Name", description: "Buisness Name" }),
    (0, typeorm_1.Column)({ type: "varchar" }),
    __metadata("design:type", String)
], MetaBuisnessProfiles.prototype, "buisness_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Buisness category", description: "Buisness Category" }),
    (0, typeorm_1.Column)({ type: "varchar" }),
    __metadata("design:type", String)
], MetaBuisnessProfiles.prototype, "buisness_category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "EAAxxxxxx", description: "Page Access Token" }),
    (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
    __metadata("design:type", String)
], MetaBuisnessProfiles.prototype, "access_token", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => agency_profiles_entity_1.AgencyProfile, (agency) => agency.buisness_profile),
    __metadata("design:type", agency_profiles_entity_1.AgencyProfile)
], MetaBuisnessProfiles.prototype, "agency_profile", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_entity_1.User, (user) => user.buisness_profiles),
    __metadata("design:type", user_entity_1.User)
], MetaBuisnessProfiles.prototype, "users", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "timestamp with time zone" }),
    __metadata("design:type", Date)
], MetaBuisnessProfiles.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: "timestamp with time zone" }),
    __metadata("design:type", Date)
], MetaBuisnessProfiles.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], MetaBuisnessProfiles.prototype, "deletedAt", void 0);
exports.MetaBuisnessProfiles = MetaBuisnessProfiles = __decorate([
    (0, typeorm_1.Entity)("buisness_profiles")
], MetaBuisnessProfiles);
//# sourceMappingURL=meta_buisness.entity.js.map