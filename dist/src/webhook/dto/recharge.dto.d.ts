export declare class RechargeDto {
    amount: number;
    paymentId: string;
    paymentMethod: "stripe" | "revenuecat";
}
export declare class WithDrawDto {
    amount: number;
    paymentMethod: "stripe" | "revenuecat";
}
