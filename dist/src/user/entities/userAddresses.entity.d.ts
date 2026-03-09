import { User } from "./user.entity";
export declare class UserAddress {
    id: string;
    user_id: string;
    user: User;
    address: string;
    house_number: string;
    address_2: string;
    city: string;
    country: string;
    postal_code: string;
    country_state: string;
    latitude: number;
    longitude: number;
    createdAt: Date;
    updatedAt: Date;
}
