import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorators/roles.decorator";
import { UserRoles as Role } from "../enums/role.enum";

/**
 * Role Guard to restrict access to APIs that should be accessible to certain user roles only.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }

    const { user, userInfo } = context.switchToHttp().getRequest();

    return requiredRoles.some((role) => userInfo.roles?.includes(role));
  }
}
