import { Repository } from "typeorm";
import { UserAddress } from "./entities/userAddresses.entity";
import { User } from "./entities/user.entity";
import { CreateUserAddressDto } from "./dto/create-user-address.dto";
export declare class UserAddressService {
    private readonly _userAddressRepository;
    constructor(_userAddressRepository: Repository<UserAddress>);
    createAddress(user: User, createDto: CreateUserAddressDto): Promise<{
        message: string;
        statusCode: number;
        data: UserAddress;
    }>;
    findAll(): Promise<UserAddress[]>;
    findByUserId(userId: string): Promise<{
        message: string;
        statusCode: number;
        data: UserAddress;
    }>;
}
