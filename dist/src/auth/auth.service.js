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
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const crypto_1 = require("crypto");
const otp_entity_1 = require("../otp/entities/otp.entity");
const otp_service_1 = require("../otp/otp.service");
const redis_service_1 = require("../redis/redis.service");
const verification_dto_1 = require("../user/dto/verification-dto");
const verification_entity_1 = require("../user/entities/verification.entity");
const typeorm_2 = require("typeorm");
const mail_service_1 = require("../mail/mail.service");
const logger_decorator_1 = require("../shared/decorators/logger.decorator");
const user_entity_1 = require("../user/entities/user.entity");
const argon2_1 = require("../utils/hashes/argon2");
let AuthService = AuthService_1 = class AuthService {
    constructor(_userRepository, _verificationRepository, _otpService, _jwtService, _mailService, _configService, _logger, _dataSource, _redisService, _otpQueue, _authQueue) {
        this._userRepository = _userRepository;
        this._verificationRepository = _verificationRepository;
        this._otpService = _otpService;
        this._jwtService = _jwtService;
        this._mailService = _mailService;
        this._configService = _configService;
        this._logger = _logger;
        this._dataSource = _dataSource;
        this._redisService = _redisService;
        this._otpQueue = _otpQueue;
        this._authQueue = _authQueue;
        this._FR_HOST = _configService.get(`FR_BASE_URL`);
    }
    async signup(createUserDto, req) {
        const queryRunner = this._dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const { password, email, ...rest } = createUserDto;
            const hashedPassword = await (0, argon2_1.argon2hash)(password);
            const user = await this._dataSource
                .createQueryBuilder()
                .insert()
                .into(user_entity_1.User)
                .values({
                ...rest,
                email,
                password: hashedPassword,
            })
                .returning("id,first_name, last_name, email, id, roles, status, image")
                .execute();
            await queryRunner.manager.insert("verifications", {
                user_id: user.raw[0].id,
                status: verification_dto_1.AccountStatus.INACTIVE,
            });
            await queryRunner.commitTransaction();
            const token = await this.signTokenSendEmailAndSMS(user.raw[0]);
            await this._otpQueue.add("create", { user: user.raw[0], otpType: otp_entity_1.OtpType.REGISTRATION });
            return {
                ok: true,
                data: user.raw[0],
                token,
            };
        }
        catch (err) {
            console.log(err);
            await queryRunner.rollbackTransaction();
            if (err.code === "23505") {
                throw new common_1.ConflictException("Email already exists");
            }
            throw err;
        }
        finally {
            await queryRunner.release();
        }
    }
    async updateRefreshToken(userId, refreshToken) {
        const hashedRefreshToken = await (0, argon2_1.argon2hash)(refreshToken);
        await this._userRepository.update(userId, {
            current_refresh_token: hashedRefreshToken,
        });
    }
    async generateTokens(user, device_id) {
        const accessPayload = {
            id: user.id,
            type: "access",
        };
        const refreshPayload = {
            id: user.id,
            type: "refresh",
            device_id,
        };
        const [accessToken, refreshToken] = await Promise.all([
            this._jwtService.signAsync(accessPayload, {
                secret: this._configService.get("JWT_ACCESS_SECRET"),
                expiresIn: this._configService.get("AUTH_JWT_ACCESS_TOKEN_EXPIRED"),
            }),
            this._jwtService.signAsync(refreshPayload, {
                secret: this._configService.get("JWT_REFRESH_SECRET"),
                expiresIn: this._configService.get("AUTH_JWT_REFRESH_TOKEN_EXPIRED"),
            }),
        ]);
        return { accessToken, refreshToken };
    }
    handleDatabaseError(err) {
        if (err instanceof common_1.HttpException)
            throw err;
        if (err.code === "23505") {
            throw new common_1.ConflictException("Identity already exists");
        }
        throw new common_1.InternalServerErrorException("An unexpected error occurred during registration");
    }
    async verfication(verificationDto) {
        const { user_id, is_email_verified, is_admin_verified, is_suspended, is_deleted, status } = verificationDto;
        this._logger.log("Creating Verification", AuthService_1.name);
        const verification = this._verificationRepository.create({
            user_id,
            is_email_verified,
            is_admin_verified,
            is_suspended,
            is_deleted,
            status,
        });
        return await this._verificationRepository.save(verification);
    }
    async verifyOtp(otpDto, userInfo) {
        const { otp, verification_type } = otpDto;
        const verification = await this._otpService.findOtpByUserId(userInfo.id);
        if (!verification) {
            throw new common_1.NotFoundException("OTP record not found or already used");
        }
        if (new Date() > verification.expiresAt) {
            await this._otpService.removeOtpByUserId(userInfo.id);
            throw new common_1.BadRequestException("OTP has expired");
        }
        if (verification.attempts >= 3) {
            await this._otpService.removeOtpByUserId(userInfo.id);
            throw new common_1.BadRequestException("Too many failed attempts. Please request a new code.");
        }
        if (verification.otp !== otp) {
            await this._otpService.updateOtpAttempts(userInfo.id, verification.attempts + 1);
            throw new common_1.BadRequestException("Invalid verification code");
        }
        return await this._dataSource.transaction(async (manager) => {
            const userVerification = await manager.findOne(verification_entity_1.Verification, {
                where: { user_id: userInfo.id },
            });
            if (!userVerification)
                throw new common_1.NotFoundException("User verification record missing");
            userVerification.is_email_verified = true;
            userVerification.status = verification_dto_1.AccountStatus.ACTIVE;
            await manager.save(userVerification);
            await this._otpService.removeOtpByUserId(userInfo.id);
            if (verification_type === otp_entity_1.OtpType.FORGOT_PASSWORD) {
                const resetToken = this._jwtService.sign({ id: userInfo.id, purpose: "password_reset" }, { expiresIn: "15m" });
                return {
                    status: "success",
                    message: "OTP verified. You may now reset your password.",
                    reset_token: resetToken,
                };
            }
            return {
                status: "success",
                message: "Account verified successfully",
            };
        });
    }
    async resetPassword(resetPasswordDto, user) {
        const { password, passwordConfirm } = resetPasswordDto;
        if (password !== passwordConfirm) {
            throw new common_1.BadRequestException("Password does not match with passwordConfirm");
        }
        this._logger.log("Masking Password", AuthService_1.name);
        console.log(user);
        const userinfo = await this._userRepository.findOne({ where: { id: user.id } });
        if (!user) {
            throw new common_1.NotFoundException("User not found");
        }
        if (user.verification_type !== otp_entity_1.OtpType.FORGOT_PASSWORD) {
            throw new common_1.BadRequestException("Invalid verification type for password reset");
        }
        const isPassMatched = await (0, argon2_1.argon2verify)(userinfo.password, password);
        if (isPassMatched) {
            throw new common_1.BadRequestException("New password cannot be the same as the old password");
        }
        this._logger.log("Hashing Password", AuthService_1.name);
        0;
        const hashedPassword = await (0, argon2_1.argon2hash)(password);
        userinfo.password = hashedPassword;
        this._logger.log("Saving Updated User", AuthService_1.name);
        await this._userRepository.save(userinfo);
        return { message: "Password reset successfully", status: "success", data: null };
    }
    async updatePassword(resetPasswordDto, user) {
        const { passwordCurrent, password, passwordConfirm } = resetPasswordDto;
        if (password !== passwordConfirm) {
            throw new common_1.BadRequestException("Password does not match with passwordConfirm");
        }
        this._logger.log("Masking Password", AuthService_1.name);
        const userinfo = await this._userRepository.findOne({ where: { id: user.id } });
        if (!user) {
            throw new common_1.NotFoundException("User not found");
        }
        const isPassMatched = await (0, argon2_1.argon2verify)(userinfo.password, passwordCurrent);
        if (!isPassMatched) {
            throw new common_1.BadRequestException("Wrong Password!");
        }
        this._logger.log("Hashing Password", AuthService_1.name);
        0;
        const hashedPassword = await (0, argon2_1.argon2hash)(password);
        userinfo.password = hashedPassword;
        this._logger.log("Saving Updated User", AuthService_1.name);
        await this._userRepository.save(userinfo);
        this._mailService.sendPasswordUpdateEmail(userinfo);
        return { message: "Password updated successfully", status: "success", data: null };
    }
    async loginPassport(loginUserDto) {
        const { email, password } = loginUserDto;
        this._logger.log("Searching User with provided email", AuthService_1.name);
        const user = await this._userRepository.findOne({ where: { email } });
        console.log(user);
        this._logger.log("Verifying User", AuthService_1.name);
        if (user && (await (0, argon2_1.argon2verify)(user.password, password))) {
            const verification = await this._verificationRepository.findOne({ where: { user_id: user.id } });
            if (!verification?.is_email_verified) {
                await this._otpService.createOtp(user.id, otp_entity_1.OtpType.REGISTRATION);
                const token = this._jwtService.sign({ id: user.id, verification_type: otp_entity_1.OtpType.REGISTRATION });
                return token;
            }
            this._logger.log("User Verified", AuthService_1.name);
            return user;
        }
        return null;
    }
    async appleLogin(token) {
        if (!token)
            throw new common_1.BadRequestException("Token Not Found");
        const { sub: userId, email, auth_time: loginTime } = this._jwtService.decode(token);
        return {
            user: { userId, email, loginTime },
            token,
        };
    }
    async updateMyPassword(updateMyPassword, user) {
        const { passwordCurrent, password, passwordConfirm } = updateMyPassword;
        console.log(passwordCurrent, password);
        this._logger.log("Verifying current password from user", AuthService_1.name);
        if (!(await (0, argon2_1.argon2verify)(user.password, passwordCurrent))) {
            throw new common_1.UnauthorizedException("Invalid password");
        }
        if (password === passwordCurrent) {
            throw new common_1.BadRequestException("New password and old password can not be same");
        }
        if (password !== passwordConfirm) {
            throw new common_1.BadRequestException("Password does not match with passwordConfirm");
        }
        this._logger.log("Masking Password", AuthService_1.name);
        const hashedPassword = await (0, argon2_1.argon2hash)(password);
        user.password = hashedPassword;
        this._logger.log("Saving Updated User", AuthService_1.name);
        await this._userRepository.save(user);
        this._logger.log("Sending password update mail", AuthService_1.name);
        this._mailService.sendPasswordUpdateEmail(user);
        this._logger.log("Login the user and send the token again", AuthService_1.name);
        const token = await this._jwtService.sign(user);
        return { user, token };
    }
    async deleteMyAccount() {
        throw new common_1.BadRequestException("Method not implemented.");
    }
    async userNotAccepted({ existingToken }) {
        const payload = await this._jwtService.verify(existingToken);
        const token = await this._jwtService.sign({ id: payload.id, verification_type: otp_entity_1.OtpType.REGISTRATION });
        const userinfo = await this._userRepository.findOne({ where: { id: payload.id } });
        const otp = await this._otpService.createOtp(payload.id, otp_entity_1.OtpType.REGISTRATION);
        await this._mailService.sendUserConfirmationMail(userinfo, `${otp.otp}`);
        return token;
    }
    async login(loginDto, ip) {
        const { email, password, fcm } = loginDto;
        const attemptKey = `login:fail:${email}:${ip}`;
        const attempts = await this._redisService.getLoginAttempts(attemptKey);
        if (attempts >= 5) {
            throw new common_1.HttpException("Too many login attempts. Try again later.", common_1.HttpStatus.TOO_MANY_REQUESTS);
        }
        const user = await this._userRepository
            .createQueryBuilder("user")
            .addSelect("user.password")
            .leftJoinAndSelect("user.buisness_profiles", "businessProfile")
            .leftJoinAndSelect("user.agency_profiles", "agencyProfile")
            .where("user.email = :email", { email })
            .getOne();
        if (!user) {
            await this._redisService.incrementLoginAttempts(attemptKey);
            throw new common_1.UnauthorizedException("Invalid credentials");
        }
        const isPasswordValid = await (0, argon2_1.argon2verify)(user.password, password);
        if (!isPasswordValid) {
            await this._redisService.incrementLoginAttempts(attemptKey);
            throw new common_1.UnauthorizedException("Invalid credentials");
        }
        await this._redisService.resetLoginAttempts(attemptKey);
        const { accessToken, refreshToken } = await this.generateTokens(user);
        const REFRESH_TOKEN_TTL = 7 * 24 * 60 * 60;
        const REFERESH_TOKEN_CACHE_KEY = `refresh:token:${user.id}:${loginDto.device_id}`;
        const hashedRT = (0, crypto_1.createHash)("sha256").update(refreshToken).digest("hex");
        this._logger.log(`Storing refresh token in Redis REFERESH== ${hashedRT}`, AuthService_1.name);
        await this._redisService.getClient().set(REFERESH_TOKEN_CACHE_KEY, hashedRT, { EX: REFRESH_TOKEN_TTL });
        if (fcm) {
            await this._authQueue.add("fcm_store", { user, fcm });
        }
        return {
            ok: true,
            data: {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                roles: user.roles,
                isActive: user.is_active,
                status: user.status,
                buisness_profile: user.buisness_profiles,
                agency_profile: user.agency_profiles,
            },
            tokens: {
                access_token: accessToken,
                refresh_token: refreshToken,
            },
        };
    }
    async signToken(user) {
        const payload = { id: user.id };
        this._logger.log("Signing token", AuthService_1.name);
        if (!user.first_name) {
            const payload = { id: user.id, verification_type: "registration" };
            return this._jwtService.sign(payload);
        }
        return this._jwtService.sign(payload);
    }
    async userInfo(user) {
        return await this._userRepository.findOne({
            where: { id: user.id },
            select: { password: false },
            relations: ["addressDetails"],
        });
    }
    async signTokenSendEmailAndSMS(user) {
        const token = await this.signToken(user);
        return token;
    }
    async resendOtp({ user, otpType, userInfo }) {
        if (!user.verification_type || otpType !== otp_entity_1.OtpType.REGISTRATION) {
            const otp = await this._otpQueue.add("create", { user, otpType: otp_entity_1.OtpType.FORGOT_PASSWORD });
            return { message: "OTP resent successfully", status: "success", data: null };
        }
        this._logger.log(`Resending OTP to user with ID: ${user.id}`, AuthService_1.name);
        const existingOtp = await this._otpService.findOtpByUserId(user.id);
        if (existingOtp?.createdAt) {
            const otpCreatedAt = existingOtp.createdAt.getTime();
            const timeDifference = Date.now() - otpCreatedAt;
            if (timeDifference < 2 * 1000 * 60) {
                throw new common_1.BadRequestException("You can only request a new OTP after 2 minute.");
            }
            await this._otpService.removeOtpByUserId(user.id);
        }
        const otp = await this._otpService.createOtp(user.id, otp_entity_1.OtpType.FORGOT_PASSWORD);
        await this._mailService.sendForgotPasswordMail(user.email, `${otp.otp}`);
        return { message: "OTP resent successfully", status: "success", data: null };
    }
    async forgetPassword(req, email) {
        const user = (await this._userRepository.findOne({ where: { email } }));
        user.verification_type = otp_entity_1.OtpType.FORGOT_PASSWORD;
        if (!user) {
            throw new common_1.NotFoundException("User not found");
        }
        const token = await this._jwtService.sign({ id: user.id, verification_type: otp_entity_1.OtpType.FORGOT_PASSWORD });
        await this.resendOtp({ user });
        return { message: "Forgot password email sent successfully", status: "success", data: null, token };
    }
    async sendOtp(req) {
        const user = req.user;
        if (!user) {
            throw new common_1.NotFoundException("User not found");
        }
        const existingOtp = await this._otpService.findOtpByUserId(user.id);
        if (existingOtp) {
            await this._otpService.removeOtpByUserId(user.id);
        }
        await this._otpService.createOtp(user.id, otp_entity_1.OtpType.REGISTRATION);
        return { message: "OTP resent successfully", status: "success", data: null };
    }
    async uploadImage({ imageUrl, user }) {
        const updateUser = await this._userRepository.update(user.id, { image: imageUrl });
        if (!updateUser) {
            throw new common_1.NotFoundException("User not found");
        }
        return { message: "Image uploaded successfully", status: "success", data: null };
    }
    async refreshToken(refreshTokenDto) {
        const { refresh_token, device_id } = refreshTokenDto;
        let payload;
        try {
            payload = await this._jwtService.verifyAsync(refresh_token, {
                secret: process.env.JWT_REFRESH_SECRET,
            });
            console.log(payload);
        }
        catch (err) {
            throw new common_1.UnauthorizedException("Invalid refresh token");
        }
        if (payload.type !== "refresh") {
            throw new common_1.UnauthorizedException("Invalid token type");
        }
        const userId = payload.id;
        const cacheKey = `refresh:token:${userId}:${device_id}`;
        const storedHash = await this._redisService.getClient().get(cacheKey);
        this._logger.log(`Fetched stored hash from Redis for key: ${storedHash} for ${cacheKey}`, AuthService_1.name);
        if (!storedHash) {
            throw new common_1.UnauthorizedException("Refresh token expired or revoked");
        }
        const incomingHash = (0, crypto_1.createHash)("sha256").update(refresh_token).digest("hex");
        console.log(incomingHash, storedHash);
        const isValid = incomingHash === storedHash;
        if (!isValid) {
            throw new common_1.UnauthorizedException("Refresh token mismatch");
        }
        const user = await this._userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.UnauthorizedException("User not found");
        }
        const { accessToken, refreshToken: newRefreshToken } = await this.generateTokens(user, device_id);
        const REFRESH_TOKEN_TTL = 7 * 24 * 60 * 60;
        const newHashedRT = (0, crypto_1.createHash)("sha256").update(newRefreshToken).digest("hex");
        await this._redisService.getClient().set(cacheKey, newHashedRT, { EX: REFRESH_TOKEN_TTL });
        return {
            ok: true,
            tokens: {
                access_token: accessToken,
                refresh_token: newRefreshToken,
            },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(verification_entity_1.Verification)),
    __param(6, (0, logger_decorator_1.InjectLogger)()),
    __param(9, (0, bull_1.InjectQueue)("otp")),
    __param(10, (0, bull_1.InjectQueue)("authentication")),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        otp_service_1.OtpService,
        jwt_1.JwtService,
        mail_service_1.MailService,
        config_1.ConfigService,
        common_1.Logger,
        typeorm_2.DataSource,
        redis_service_1.RedisService, Object, Object])
], AuthService);
//# sourceMappingURL=auth.service.js.map