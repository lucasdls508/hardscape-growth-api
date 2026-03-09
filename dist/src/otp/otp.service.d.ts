import { Otp, OtpType } from "./entities/otp.entity";
import { Repository } from "typeorm";
export declare class OtpService {
    private otpRepository;
    constructor(otpRepository: Repository<Otp>);
    generateOtp(length?: number): string;
    createOtp(userId: string, type: OtpType): Promise<Otp>;
    validateOtp(user_id: string, otp: string, type: OtpType): Promise<Otp | null>;
    findOtpByUserId(user_id: string): Promise<Otp | null>;
    updateOtpAttempts(user_id: string, attempts: number): Promise<void>;
    removeOtpByUserId(user_id: string): Promise<void>;
}
