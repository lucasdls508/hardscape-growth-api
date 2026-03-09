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
exports.UserAddress = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const user_entity_1 = require("./user.entity");
const class_validator_1 = require("class-validator");
let UserAddress = class UserAddress {
};
exports.UserAddress = UserAddress;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UserAddress.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, swagger_1.ApiProperty)({ description: "User ID associated with the verification" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UserAddress.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: "user_id" }),
    (0, swagger_1.ApiProperty)({ type: () => user_entity_1.User }),
    __metadata("design:type", user_entity_1.User)
], UserAddress.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
    (0, swagger_1.ApiProperty)({ example: "221B Baker Street" }),
    __metadata("design:type", String)
], UserAddress.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
    (0, swagger_1.ApiProperty)({ example: "221B" }),
    __metadata("design:type", String)
], UserAddress.prototype, "house_number", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
    (0, swagger_1.ApiProperty)({ example: "Apartment 4A" }),
    __metadata("design:type", String)
], UserAddress.prototype, "address_2", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
    (0, swagger_1.ApiProperty)({ example: "London" }),
    __metadata("design:type", String)
], UserAddress.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 5, nullable: true }),
    (0, swagger_1.ApiProperty)({ example: "GB" }),
    __metadata("design:type", String)
], UserAddress.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
    (0, swagger_1.ApiProperty)({ example: "NW1 6XE" }),
    __metadata("design:type", String)
], UserAddress.prototype, "postal_code", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
    (0, swagger_1.ApiProperty)({ example: "England" }),
    __metadata("design:type", String)
], UserAddress.prototype, "country_state", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 10, scale: 6, nullable: true }),
    (0, swagger_1.ApiProperty)({ example: 51.523767 }),
    __metadata("design:type", Number)
], UserAddress.prototype, "latitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 10, scale: 6, nullable: true }),
    (0, swagger_1.ApiProperty)({ example: -0.1585557 }),
    __metadata("design:type", Number)
], UserAddress.prototype, "longitude", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], UserAddress.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], UserAddress.prototype, "updatedAt", void 0);
exports.UserAddress = UserAddress = __decorate([
    (0, typeorm_1.Entity)({ name: "user_addresses" })
], UserAddress);
//# sourceMappingURL=userAddresses.entity.js.map