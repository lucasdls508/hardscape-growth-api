export declare function FeeWithCommision(charge: number, percent?: number): number;
export declare function validateAddress<T extends Record<string, any>>({ dto, requiredFields, }: {
    dto: T;
    requiredFields: string[];
}): void;
