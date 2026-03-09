import { User } from "../../user/entities/user.entity";
export declare class UserResponseDto {
    status: string;
    data: User;
    token: string;
}
