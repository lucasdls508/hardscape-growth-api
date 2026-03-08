import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";

@Injectable()
export class CheckBuisnessGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const { user, userInfo } = context.switchToHttp().getRequest();

    if (userInfo.agency_profiles.length <= 0) {
      throw new ForbiddenException("Your Agency is not setup yet! Please Fill the required information.");
    }
    const connected_agency = userInfo.agency_profiles[0];
    const requiredFields = [
      { key: "nid_front", message: "Nid Front image is not attached with your account!" },
      { key: "nid_back", message: "Nid Back image is not attached with your account!" },
      { key: "tax_id_front", message: "Tax Front image is not attached with your account!" },
      { key: "tax_id_back", message: "Tax Back image is not attached with your account!" },
      // { key: "contact_phone", message: "Please fill up your contact number!" },
    ];

    for (const field of requiredFields) {
      if (!connected_agency?.[field.key]) {
        console.log("Value");
        throw new ForbiddenException(field.message);
      }
    }

    if (!userInfo.buisness_profiles) {
      // return false
      throw new ForbiddenException(
        "Your Buisness profile is not setup yet ! Wait until admin attach your buisness ."
      );
    }
    return true;
  }
}
