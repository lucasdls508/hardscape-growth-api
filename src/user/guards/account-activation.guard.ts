import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";

/**
 * Account Activation guard to restrict access for activated accounts.
 */
@Injectable()
export class AccountActivatedGuard implements CanActivate {
  /**
   * it checks if user is active
   * @param context execution context for current request.
   * @returns true if user is active otherwise false
   */
  canActivate(context: ExecutionContext): boolean {
    const { user, userInfo } = context.switchToHttp().getRequest();

    // if (user.status) return true;
    if (userInfo.status !== "not_verified") return false;

    throw new ForbiddenException("Please activate your account");
  }
}
