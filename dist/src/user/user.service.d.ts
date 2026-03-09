import { Logger } from "@nestjs/common";
import { CreateAdminDto } from "src/auth/dto/create-user.dto";
import { RedisService } from "src/redis/redis.service";
import { DataSource, Repository } from "typeorm";
import { MailService } from "../mail/mail.service";
import { GetUsersQueryDto } from "./dto/get-user.query.dto";
import { UpdateUserProfileDto } from "./dto/update-profile.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";
import { Verification } from "./entities/verification.entity";
export declare class UserService {
    private _userRepository;
    private _verificationRepo;
    private readonly _logger;
    private readonly _redisService;
    private readonly _mailService;
    private _dataSource;
    constructor(_userRepository: Repository<User>, _verificationRepo: Repository<Verification>, _logger: Logger, _redisService: RedisService, _mailService: MailService, _dataSource: DataSource);
    createUser(userData: Partial<User>): Promise<{
        data: Partial<User>;
        ok: boolean;
        message: string;
    }>;
    getMe(userId: string): Promise<User>;
    getUserFilters(query: GetUsersQueryDto): Promise<{
        message: string;
        status: string;
        statusCode: number;
        data: User[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getAllUsers(): Promise<User[]>;
    getTotalUsersCount(): Promise<number>;
    createSuperAdmin(body: CreateAdminDto): Promise<string>;
    updateProfile(userId: string, updateDto: UpdateUserProfileDto): Promise<User>;
    updateUser(user_id: string, query: {
        fcm?: string;
    }): Promise<import("typeorm").UpdateResult>;
    getUserById(id: string, relations?: string[]): Promise<User>;
    getUser(id: string): Promise<User>;
    getUserByEmail(email: string): Promise<User>;
    getMultipleUserByIds(userIds: string[]): Promise<User[]>;
    updateUserData(updateUserDto: UpdateUserDto, user: User): Promise<User | {
        message: string;
    }>;
    updateImage({ imageUrl, user }: {
        imageUrl: string;
        user: User;
    }): Promise<{
        message: string;
        status: string;
        data: any;
    }>;
    verifyEmailChange(userId: string, otp: string): Promise<{
        message: string;
    }>;
    updateUserUpdatedTimeAndOfflineStatus({ user_id }: {
        user_id: string;
        user?: Partial<User>;
    }): Promise<import("typeorm").UpdateResult>;
    findUsersByAgency(agencyId: string, page: number, limit: number): Promise<[User[], number]>;
}
