import { RedisService } from "src/redis/redis.service";
import { Repository } from "typeorm";
import { Catalogs } from "./enitities/catalogs.entity";
export declare class CatalogsService {
    private readonly _catalogsRepo;
    private readonly _redisService;
    private readonly LIST_TTL;
    private readonly ITEM_TTL;
    constructor(_catalogsRepo: Repository<Catalogs>, _redisService: RedisService);
    create(data: Partial<Catalogs>): Promise<Catalogs>;
    findAll(page?: number, limit?: number, search?: string): Promise<any>;
    findOne(id: number): Promise<Catalogs>;
    update(id: number, data: Partial<Catalogs>): Promise<Catalogs>;
    remove(id: number): Promise<void>;
    private invalidateCatalogCache;
}
