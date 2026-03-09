import { Type } from "@nestjs/common";
type ParamType = {
    isArray: boolean;
};
export declare const ApiSuccessResponse: <TModel extends Type<any>>(model: TModel, description?: string, options?: ParamType) => <TFunction extends Function, Y>(target: TFunction | object, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<Y>) => void;
export {};
