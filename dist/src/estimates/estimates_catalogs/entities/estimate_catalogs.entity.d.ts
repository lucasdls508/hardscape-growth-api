import { Catalogs } from "src/catalogs/enitities/catalogs.entity";
import { Estimates } from "src/estimates/entities/estimates.entity";
export declare class EstimateCatalogs {
    id: number;
    estimate_id: number;
    estimate: Estimates;
    catalog_id: number;
    catalog: Catalogs;
    quantity: number;
    unit_cost: number;
    unit_price: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
