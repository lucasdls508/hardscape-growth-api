import { CreateAgencyOwnerDto } from "src/agency_profiles/dtos/create_agency_owner.dto";
import { ApiResponseDto } from "../shared/dto/base-response.dto";
import { ContructorsService } from "./contructors/contructors.service";
import { CreateMemberDto } from "./contructors/dto/CreateAgencyMembers.dto";
import { GetUsersQueryDto } from "./dto/get-user.query.dto";
import { UpdateUserProfileDto } from "./dto/update-profile.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";
import { UserService } from "./user.service";
import { UserAddressService } from "./userAddress.service";
export declare class UserController {
    private readonly _userService;
    private readonly _userAddressService;
    private readonly _contructorService;
    constructor(_userService: UserService, _userAddressService: UserAddressService, _contructorService: ContructorsService);
    createAgencyOwner(body: CreateAgencyOwnerDto): Promise<{
        data: Partial<User>;
        ok: boolean;
        message: string;
    }>;
    createMember(body: CreateMemberDto, user: User, userInfo: User): Promise<{
        ok: boolean;
        message: string;
        data: any;
    }>;
    getAllUsers(query: GetUsersQueryDto): Promise<{
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
    getUser(user: User): Promise<ApiResponseDto<User>>;
    updateUserDetails(updateUserDto: UpdateUserDto, user: User): Promise<User | {
        message: string;
    }>;
    verifyEmailChange(body: {
        otp: string;
    }, user: User): Promise<{
        message: string;
    }>;
    updateProfilePicture(user: User, fileDestination: string): Promise<{
        status: string;
        data: any;
        message: string;
        statusCode: number;
    }>;
    getUserById(id: string): Promise<ApiResponseDto<User>>;
    getUserProfile(id: string): Promise<ApiResponseDto<User>>;
    updateProfile(user: User, req: any, updateDto: UpdateUserProfileDto): Promise<{
        message: string;
        data: User;
        status: string;
        statuscode: number;
    }>;
}
