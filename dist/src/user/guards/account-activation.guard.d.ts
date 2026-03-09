import { CanActivate, ExecutionContext } from "@nestjs/common";
export declare class AccountActivatedGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean;
}
