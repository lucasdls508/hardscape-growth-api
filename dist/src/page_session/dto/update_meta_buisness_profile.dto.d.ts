import { CreateMetaBusinessProfileDto } from "./create_meta_buisness_profile.dto";
declare const UpdateMetaBusinessProfileDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateMetaBusinessProfileDto>>;
export declare class UpdateMetaBusinessProfileDto extends UpdateMetaBusinessProfileDto_base {
    page_id?: string;
    user_id?: string;
    buisness_name?: string;
}
export {};
