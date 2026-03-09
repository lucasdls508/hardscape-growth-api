import { UserRoles } from "src/user/enums/role.enum";
export declare class CreateUserDto {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    password: string;
}
export declare class CreateAdminDto extends CreateUserDto {
    roles: UserRoles[];
}
