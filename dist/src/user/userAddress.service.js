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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAddressService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const userAddresses_entity_1 = require("./entities/userAddresses.entity");
let UserAddressService = class UserAddressService {
    constructor(_userAddressRepository) {
        this._userAddressRepository = _userAddressRepository;
    }
    async createAddress(user, createDto) {
        const address = await this._userAddressRepository.findOne({ where: { user: { id: user.id } } });
        if (!address) {
            const newAddress = this._userAddressRepository.create({
                ...createDto,
                user,
            });
            await this._userAddressRepository.save(newAddress);
            return { message: "Address saved successfully!", statusCode: 201, data: newAddress };
        }
        Object.assign(address, createDto);
        console.log("Address", address);
        await this._userAddressRepository.save(address);
        return { message: "Address saved successfully!", statusCode: 201, data: address };
    }
    async findAll() {
        return await this._userAddressRepository.find({ relations: ["user"] });
    }
    async findByUserId(userId) {
        const address = await this._userAddressRepository.findOne({
            where: { user: { id: userId } },
            relations: ["user"],
        });
        if (!address)
            throw new common_1.NotFoundException(`Address not found for user ID: ${userId}`);
        return { message: "drop off point retrived", statusCode: 200, data: address };
    }
};
exports.UserAddressService = UserAddressService;
exports.UserAddressService = UserAddressService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(userAddresses_entity_1.UserAddress)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserAddressService);
//# sourceMappingURL=userAddress.service.js.map