import { Strategy } from "passport-jwt";
import { User } from "../../user/entities/user.entity";
import { JwtPayload } from "../dto/jwt-payload.dto";
import { ConfigService } from "@nestjs/config";
import { UserService } from "../../user/user.service";
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly userService;
    private readonly configService;
    constructor(userService: UserService, configService: ConfigService);
    validate(payload: JwtPayload): Promise<User>;
}
export {};
