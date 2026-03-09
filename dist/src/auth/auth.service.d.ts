import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Queue } from "bull";
import { Request } from "express";
import { OtpType } from "src/otp/entities/otp.entity";
import { OtpService } from "src/otp/otp.service";
import { RedisService } from "src/redis/redis.service";
import { CreateVerificationDto } from "src/user/dto/verification-dto";
import { Verification } from "src/user/entities/verification.entity";
import { DataSource, Repository } from "typeorm";
import { MailService } from "../mail/mail.service";
import { User } from "../user/entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import { OtpVerificationDto } from "./dto/otp-verification.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { ResetPasswordDto, UpdatePassword } from "./dto/reset-password.dto";
import { UpdateMyPasswordDto } from "./dto/update-password.dto";
export declare class AuthService {
    private _userRepository;
    private _verificationRepository;
    private readonly _otpService;
    private readonly _jwtService;
    private readonly _mailService;
    private readonly _configService;
    private readonly _logger;
    private readonly _dataSource;
    private readonly _redisService;
    private _otpQueue;
    private _authQueue;
    private _FR_HOST;
    constructor(_userRepository: Repository<User>, _verificationRepository: Repository<Verification>, _otpService: OtpService, _jwtService: JwtService, _mailService: MailService, _configService: ConfigService, _logger: Logger, _dataSource: DataSource, _redisService: RedisService, _otpQueue: Queue, _authQueue: Queue);
    signup(createUserDto: CreateUserDto, req: Request): Promise<{
        ok: boolean;
        data: any;
        token: string;
    }>;
    updateRefreshToken(userId: string, refreshToken: string): Promise<void>;
    private generateTokens;
    private handleDatabaseError;
    verfication(verificationDto: CreateVerificationDto): Promise<Verification>;
    verifyOtp(otpDto: OtpVerificationDto, userInfo: User): Promise<{
        status: string;
        message: string;
        reset_token: string;
    } | {
        status: string;
        message: string;
        reset_token?: undefined;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto, user: any): Promise<{
        message: string;
        status: string;
        data: any;
    }>;
    updatePassword(resetPasswordDto: UpdatePassword, user: any): Promise<{
        message: string;
        status: string;
        data: any;
    }>;
    loginPassport(loginUserDto: LoginUserDto): Promise<string | User>;
    appleLogin(token: string): Promise<{
        user: {
            userId: any;
            email: any;
            loginTime: any;
        };
        token: string;
    }>;
    updateMyPassword(updateMyPassword: UpdateMyPasswordDto, user: User): Promise<{
        user: User;
        token: string;
    }>;
    deleteMyAccount(): Promise<boolean>;
    userNotAccepted({ existingToken }: {
        existingToken: string;
    }): Promise<string>;
    login(loginDto: LoginUserDto, ip: string): Promise<{
        ok: boolean;
        data: {
            id: string;
            first_name: string;
            last_name: string;
            email: string;
            roles: import("../user/enums/role.enum").UserRoles[];
            isActive: boolean;
            status: import("../user/entities/user.entity").USER_STATUS;
            buisness_profile: import("../page_session/entites/meta_buisness.entity").MetaBuisnessProfiles;
            agency_profile: import("../agency_profiles/entities/agency_profiles.entity").AgencyProfile[];
        };
        tokens: {
            access_token: string;
            refresh_token: string;
        };
    }>;
    signToken(user: any): Promise<string>;
    userInfo(user: User): Promise<User>;
    signTokenSendEmailAndSMS(user: User): Promise<string>;
    resendOtp({ user, otpType, userInfo }: {
        userInfo?: any;
        user?: any;
        otpType?: OtpType;
    }): Promise<{
        message: string;
        status: string;
        data: any;
    }>;
    forgetPassword(req: Request, email: string): Promise<{
        message: string;
        status: string;
        data: any;
        token: string;
    }>;
    sendOtp(req: Request): Promise<{
        message: string;
        status: string;
        data: any;
    }>;
    uploadImage({ imageUrl, user }: {
        imageUrl: string;
        user: User;
    }): Promise<{
        message: string;
        status: string;
        data: any;
    }>;
    refreshToken(refreshTokenDto: RefreshTokenDto): Promise<{
        ok: boolean;
        tokens: {
            access_token: string;
            refresh_token: string;
        };
    }>;
}
