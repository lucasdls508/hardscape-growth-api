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
var UserService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const redis_service_1 = require("../redis/redis.service");
const pagination_1 = require("../shared/utils/pagination");
const argon2_1 = require("../utils/hashes/argon2");
const typeorm_2 = require("typeorm");
const mail_service_1 = require("../mail/mail.service");
const logger_decorator_1 = require("../shared/decorators/logger.decorator");
const user_entity_1 = require("./entities/user.entity");
const verification_entity_1 = require("./entities/verification.entity");
const role_enum_1 = require("./enums/role.enum");
let UserService = UserService_1 = class UserService {
    constructor(_userRepository, _verificationRepo, _logger, _redisService, _mailService, _dataSource) {
        this._userRepository = _userRepository;
        this._verificationRepo = _verificationRepo;
        this._logger = _logger;
        this._redisService = _redisService;
        this._mailService = _mailService;
        this._dataSource = _dataSource;
    }
    async createUser(userData) {
        const queryRunner = this._dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        const userExists = await this._userRepository.findOne({ where: { email: userData.email } });
        if (userExists) {
            throw new common_1.BadRequestException("User with this email already exists");
        }
        const hashedPassword = await (0, argon2_1.argon2hash)(userData.password);
        const newUser = this._userRepository.create({
            ...userData,
            password: hashedPassword,
        });
        return {
            ok: true,
            data: await this._userRepository.save(newUser),
            message: "User created successfully",
        };
    }
    async getMe(userId) {
        const cacheKey = `user:me:${userId}`;
        const user = await this._userRepository.findOne({
            where: { id: userId },
            relations: [
                "buisness_profiles",
                "agency_profiles",
                "works_for_agency",
            ],
        });
        if (!user) {
            throw new common_1.NotFoundException("User not found");
        }
        this._logger.log(`User ${userId} cached in Redis`);
        return user;
    }
    async getUserFilters(query) {
        const { page = 1, limit = 10, search } = query;
        const take = Number(limit);
        const skip = (Number(page) - 1) * take;
        const qb = this._userRepository.createQueryBuilder("user");
        qb.where(":role = ANY (user.roles)", { role: role_enum_1.UserRoles.USER });
        if (search) {
            qb.andWhere(`(user.first_name ILIKE :search OR user.last_name ILIKE :search)`, {
                search: `%${search}%`,
            });
        }
        if (query.status) {
            qb.where("(user.status ILIKE :status)", { status: query.status });
        }
        qb.take(take).skip(skip);
        qb.orderBy("user.createdAt", "DESC");
        const [users, total] = await qb.getManyAndCount();
        return {
            message: "users retrived successfully",
            status: "success",
            statusCode: 200,
            data: users,
            pagination: (0, pagination_1.pagination)({ page: Number(page), limit: Number(limit), total }),
        };
    }
    async getAllUsers() {
        this._logger.log("getting all users data", UserService_1.name);
        const users = await this._userRepository.find();
        return users;
    }
    async getTotalUsersCount() {
        this._logger.log("Getting total user count");
        const count = await this._userRepository.count({});
        return count;
    }
    async createSuperAdmin(body) {
        body.password = await (0, argon2_1.argon2hash)(body.password);
        const result = await this._userRepository.insert(body);
        const user = await this._userRepository.findOne({ where: { id: result.identifiers[0].id } });
        await this._verificationRepo.insert({
            user,
            is_deleted: false,
            is_email_verified: true,
        });
        return "Admin Created Successfully";
    }
    async updateProfile(userId, updateDto) {
        const user = await this._userRepository.findOne({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException("User not found");
        }
        Object.assign(user, updateDto);
        return this._userRepository.save(user);
    }
    async updateUser(user_id, query) {
        return await this._userRepository.update(user_id, query);
    }
    async getUserById(id, relations) {
        const client = this._redisService.getClient();
        const relationKey = relations ? relations.sort().join(",") : "no-relations";
        const cacheKey = `user:${id}:${relationKey}`;
        const cachedUser = await client.get(cacheKey);
        if (cachedUser) {
            return JSON.parse(cachedUser);
        }
        const query = { where: { id } };
        if (relations) {
            query.relations = relations;
        }
        const user = await this._userRepository.findOne(query);
        if (user) {
            await client.set(cacheKey, JSON.stringify(user), { EX: 3600 });
        }
        return user;
    }
    async getUser(id) {
        return await this._userRepository.findOneByOrFail({ id });
    }
    async getUserByEmail(email) {
        return await this._userRepository.findOne({ where: { email } });
    }
    async getMultipleUserByIds(userIds) {
        return await this._userRepository.findByIds(userIds);
    }
    async updateUserData(updateUserDto, user) {
        const currentUser = await this._userRepository.findOne({
            where: { id: user.id },
        });
        if (!currentUser)
            throw new common_1.NotFoundException("User Not Found");
        if (updateUserDto.email && updateUserDto.email !== currentUser.email) {
            const otp = Math.floor(1000 + Math.random() * 9000).toString();
            const cacheKey = `email-change:${user.id}`;
            await this._redisService.set(cacheKey, JSON.stringify({
                newEmail: updateUserDto.email,
                otp,
            }), 300);
            await this._mailService.sendEmailChangeOtp(updateUserDto.email, otp);
            return {
                message: "OTP sent to new email. Please verify to complete update.",
            };
        }
        Object.assign(currentUser, updateUserDto);
        await this._userRepository.save(currentUser);
        await this._redisService.del(`user:me:${user.id}`);
        return currentUser;
    }
    async updateImage({ imageUrl, user }) {
        this._logger.log(`Updating user image`, UserService_1.name);
        const updatedUser = await this._userRepository.update(user.id, { image: imageUrl });
        if (!updatedUser) {
            throw new common_1.NotFoundException("User not found");
        }
        this._logger.log(`Image updated successfully`, UserService_1.name);
        return { message: "Image uploaded successfully", status: "success", data: null };
    }
    async verifyEmailChange(userId, otp) {
        const cacheKey = `email-change:${userId}`;
        const cachedData = await this._redisService.get(cacheKey);
        if (!cachedData) {
            throw new common_1.BadRequestException("OTP expired or invalid");
        }
        const parsed = JSON.parse(cachedData);
        if (parsed.otp !== otp) {
            throw new common_1.BadRequestException("Invalid OTP");
        }
        const user = await this._userRepository.findOne({
            where: { id: userId },
        });
        if (!user)
            throw new common_1.NotFoundException("User not found");
        user.email = parsed.newEmail;
        user.status = user_entity_1.USER_STATUS.NOT_VERIFIED;
        await this._userRepository.save(user);
        await this._redisService.del(cacheKey);
        await this._redisService.del(`user:me:${userId}`);
        return { message: "Email updated successfully" };
    }
    async updateUserUpdatedTimeAndOfflineStatus({ user_id }) {
        this._logger.log(`Updating user Active Status`, UserService_1.name);
        const updatedUser = await this._userRepository.update(user_id, { is_active: false });
        if (!updatedUser) {
            throw new common_1.NotFoundException("User not found");
        }
        return updatedUser;
    }
    async findUsersByAgency(agencyId, page, limit) {
        return this._userRepository.findAndCount({
            where: {
                works_for_agency: { id: agencyId },
            },
            order: { createdAt: "DESC" },
            skip: (page - 1) * limit,
            take: limit,
        });
    }
};
exports.UserService = UserService;
exports.UserService = UserService = UserService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(verification_entity_1.Verification)),
    __param(2, (0, logger_decorator_1.InjectLogger)()),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        common_1.Logger,
        redis_service_1.RedisService,
        mail_service_1.MailService,
        typeorm_2.DataSource])
], UserService);
//# sourceMappingURL=user.service.js.map