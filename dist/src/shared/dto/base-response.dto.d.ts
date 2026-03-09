export declare class ApiResponseDto<T = any> {
    status: string;
    data: T;
}
export declare class CountApiResponseDto<T = any> extends ApiResponseDto<T> {
    count: number;
}
declare const MessageResponseDto_base: import("@nestjs/common").Type<Pick<ApiResponseDto<unknown>, "status">>;
export declare class MessageResponseDto extends MessageResponseDto_base {
    message: string;
}
export {};
