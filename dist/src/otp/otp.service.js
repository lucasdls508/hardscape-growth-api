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
exports.OtpService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const otp_entity_1 = require("./entities/otp.entity");
const typeorm_2 = require("typeorm");
let OtpService = class OtpService {
    constructor(otpRepository) {
        this.otpRepository = otpRepository;
    }
    generateOtp(length = 6) {
        let otp = "";
        for (let i = 0; i < length; i++) {
            otp += Math.floor(Math.random() * 10);
        }
        return otp;
    }
    async createOtp(userId, type) {
        await this.otpRepository.delete({ user_id: userId });
        const otp = this.generateOtp(4);
        const newOtp = this.otpRepository.create({
            otp,
            user_id: userId,
            type: type,
            expiresAt: new Date(Date.now() + 2 * 60 * 1000),
        });
        return await this.otpRepository.save(newOtp);
    }
    async validateOtp(user_id, otp, type) {
        const currentTime = new Date();
        const verification = await this.otpRepository.findOne({
            where: { user_id: user_id, otp: otp, type: type, expiresAt: (0, typeorm_2.MoreThan)(currentTime) },
        });
        if (!verification) {
            return null;
        }
        return verification;
    }
    async findOtpByUserId(user_id) {
        return await this.otpRepository.findOne({
            where: { user_id: user_id },
        });
    }
    async updateOtpAttempts(user_id, attempts) {
        await this.otpRepository.update({ user_id }, { attempts });
    }
    async removeOtpByUserId(user_id) {
        await this.otpRepository.delete({ user_id });
    }
};
exports.OtpService = OtpService;
exports.OtpService = OtpService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(otp_entity_1.Otp)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], OtpService);
//# sourceMappingURL=otp.service.js.map