import { CatalogsService } from "./catalogs.service";
import { CreateCatalogDto } from "./dtos/CreateCatalogs.dto";
import { UpdateCatalogDto } from "./dtos/UpdateCatalogs.dto";
import { Catalogs } from "./enitities/catalogs.entity";
export declare class CatalogsController {
    private readonly _catalogsService;
    constructor(_catalogsService: CatalogsService);
    create(body: CreateCatalogDto): Promise<Catalogs>;
    findAll(page: string, limit: string, search: string): Promise<{
        data: Catalogs[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: number): Promise<Catalogs>;
    update(id: number, body: UpdateCatalogDto): Promise<Catalogs>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
