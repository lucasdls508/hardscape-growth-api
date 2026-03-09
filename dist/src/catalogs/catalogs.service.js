"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CatalogsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const redis_service_1 = require("../redis/redis.service");
const typeorm_2 = require("typeorm");
const catalogs_entity_1 = require("./enitities/catalogs.entity");
let CatalogsService = class CatalogsService {
    constructor(_catalogsRepo, _redisService) {
        this._catalogsRepo = _catalogsRepo;
        this._redisService = _redisService;
        this.LIST_TTL = 60;
        this.ITEM_TTL = 120;
    }
    async create(data) {
        const catalog = this._catalogsRepo.create(data);
        const saved = await this._catalogsRepo.save(catalog);
        await this.invalidateCatalogCache();
        return saved;
    }
    async findAll(page = 1, limit = 10, search) {
        const cacheKey = `catalogs:list:page:${page}:limit:${limit}:search:${search || ""}`;
        const cached = await this._redisService.getCache(cacheKey);
        if (cached)
            return cached;
        const [data, total] = await this._catalogsRepo.findAndCount({
            where: { deletedAt: null, ...(search ? { name: (0, typeorm_2.ILike)(`%${search}%`) } : {}) },
            order: { createdAt: "DESC" },
            skip: (page - 1) * limit,
            take: limit,
        });
        const result = { data, total, page, limit };
        await this._redisService.setCacheWithTTL(cacheKey, result, this.LIST_TTL);
        return result;
    }
    async findOne(id) {
        const cacheKey = `catalogs:item:${id}`;
        const cached = await this._redisService.getCache(cacheKey);
        if (cached)
            return cached;
        const catalog = await this._catalogsRepo.findOne({
            where: { id, deletedAt: null },
        });
        if (!catalog) {
            throw new common_1.NotFoundException("Catalog not found");
        }
        await this._redisService.setCacheWithTTL(cacheKey, catalog, this.ITEM_TTL);
        return catalog;
    }
    async update(id, data) {
        const catalog = await this.findOne(id);
        Object.assign(catalog, data);
        const updated = await this._catalogsRepo.save(catalog);
        await this.invalidateCatalogCache(id);
        return updated;
    }
    async remove(id) {
        const catalog = await this.findOne(id);
        await this._catalogsRepo.softRemove(catalog);
        await this.invalidateCatalogCache(id);
    }
    async invalidateCatalogCache(id) {
        const redis = this._redisService.getClient();
        if (id) {
            await redis.del(`catalogs:item:${id}`);
        }
        let cursor = 0;
        do {
            const { cursor: nextCursor, keys } = await redis.scan(cursor, {
                MATCH: "catalogs:list:*",
                COUNT: 100,
            });
            if (keys.length) {
                await redis.del(keys);
            }
            cursor = nextCursor;
        } while (cursor !== 0);
    }
};
exports.CatalogsService = CatalogsService;
exports.CatalogsService = CatalogsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(catalogs_entity_1.Catalogs)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        redis_service_1.RedisService])
], CatalogsService);
//# sourceMappingURL=catalogs.service.js.map