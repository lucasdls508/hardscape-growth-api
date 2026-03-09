import { USER_STATUS } from "../entities/user.entity";
export declare class GetUsersQueryDto {
    page?: number;
    limit?: number;
    search?: string;
    status?: USER_STATUS;
}
