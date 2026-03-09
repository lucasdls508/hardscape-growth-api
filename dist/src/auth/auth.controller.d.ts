import { JwtService } from "@nestjs/jwt";
import { Queue } from "bull";
import { Request } from "express";
import { MailService } from "src/mail/mail.service";
import { OtpService } from "src/otp/otp.service";
import { UserService } from "src/user/user.service";
import { User } from "../user/entities/user.entity";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import { OtpVerificationDto } from "./dto/otp-verification.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { UpdateMyPasswordDto } from "./dto/update-password.dto";
export declare class AuthController {
    private readonly _authService;
    private readonly _jwtService;
    private readonly _OtpService;
    private readonly _mailService;
    private readonly _userService;
    private readonly _queue;
    constructor(_authService: AuthService, _jwtService: JwtService, _OtpService: OtpService, _mailService: MailService, _userService: UserService, _queue: Queue);
    signup(createUserDto: CreateUserDto, req: Request): Promise<{
        ok: boolean;
        data: any;
        token: string;
    }>;
    loginPassportLocal(headers: any, loginDto: LoginUserDto, req: Request): Promise<{
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
    resendOtp(req: Request, userInfo: User): Promise<{
        message: string;
        status: string;
        data: any;
    }>;
    forgotPassword(req: Request, forgotPasswordDto: ForgotPasswordDto): Promise<{
        message: string;
        status: string;
        data: any;
        token: string;
    }>;
    VerifyOtp(otp: OtpVerificationDto, user: User): Promise<{
        status: string;
        message: string;
        reset_token: string;
    } | {
        status: string;
        message: string;
        reset_token?: undefined;
    }>;
    ResetPassword(req: Request, password: ResetPasswordDto): Promise<{
        message: string;
        status: string;
        data: any;
    }>;
    updatePassword(user: User, password: UpdateMyPasswordDto): Promise<{
        message: string;
        status: string;
        data: any;
    }>;
    loginGoogle(): Promise<void>;
    loginAppleCallback(req: Request): Promise<{
        status: string;
        data: {
            userId: any;
            email: any;
            loginTime: any;
        };
        token: string;
    }>;
    logout(): Promise<{
        status: string;
        token: any;
    }>;
    refresh(refreshTokenDto: RefreshTokenDto, headers: any): Promise<{
        ok: boolean;
        tokens: {
            access_token: string;
            refresh_token: string;
        };
    }>;
    updateMyPassword(updateMyPassword: UpdateMyPasswordDto, user: User): Promise<{
        status: string;
        user: User;
        token: string;
    }>;
    deleteMyAccount(): Promise<{
        status: string;
        message: string;
    }>;
}
