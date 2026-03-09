import { ExecutionContext } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";
import { Logger } from "winston";
export declare class JwtAuthenticationGuard {
    private readonly _jwtService;
    private readonly _userService;
    private readonly _logger;
    constructor(_jwtService: JwtService, _userService: UserService, _logger: Logger);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private extractTokenFromHeader;
}
