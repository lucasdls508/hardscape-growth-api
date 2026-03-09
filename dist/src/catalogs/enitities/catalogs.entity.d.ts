import { EstimateCatalogs } from "src/estimates/estimates_catalogs/entities/estimate_catalogs.entity";
export declare class Catalogs {
    id: number;
    name: string;
    desc: string;
    unit: number;
    material_unit_cost: number;
    material_unit_price: number;
    estimate_catalogs: EstimateCatalogs[];
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
