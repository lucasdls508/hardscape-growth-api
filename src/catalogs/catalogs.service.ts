// src/catalogs/catalogs.service.ts

import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RedisClient, RedisService } from "src/redis/redis.service";
import { ILike, Repository } from "typeorm";
import { Catalogs } from "./enitities/catalogs.entity";

@Injectable()
export class CatalogsService {
  private readonly LIST_TTL = 60;
  private readonly ITEM_TTL = 120;

  constructor(
    @InjectRepository(Catalogs)
    private readonly _catalogsRepo: Repository<Catalogs>,
    private readonly _redisService: RedisService
  ) {}

  /* ---------------- CREATE ---------------- */

  async create(data: Partial<Catalogs>): Promise<Catalogs> {
    const catalog = this._catalogsRepo.create(data);
    const saved = await this._catalogsRepo.save(catalog);

    await this.invalidateCatalogCache();

    return saved;
  }

  /* ---------------- FIND ALL (PAGINATED + CACHE) ---------------- */

  async findAll(page = 1, limit = 10, search?: string) {
    const cacheKey = `catalogs:list:page:${page}:limit:${limit}:search:${search || ""}`;

    const cached = await this._redisService.getCache(cacheKey);
    if (cached) return cached;

    const [data, total] = await this._catalogsRepo.findAndCount({
      where: { deletedAt: null, ...(search ? { name: ILike(`%${search}%`) } : {}) },
      order: { createdAt: "DESC" },
      skip: (page - 1) * limit,
      take: limit,
    });

    const result = { data, total, page, limit };

    await this._redisService.setCacheWithTTL(cacheKey, result, this.LIST_TTL);

    return result;
  }

  /* ---------------- FIND ONE ---------------- */

  async findOne(id: number): Promise<Catalogs> {
    const cacheKey = `catalogs:item:${id}`;

    const cached = await this._redisService.getCache<Catalogs>(cacheKey);
    if (cached) return cached;

    const catalog = await this._catalogsRepo.findOne({
      where: { id, deletedAt: null },
    });

    if (!catalog) {
      throw new NotFoundException("Catalog not found");
    }

    await this._redisService.setCacheWithTTL(cacheKey, catalog, this.ITEM_TTL);

    return catalog;
  }

  /* ---------------- UPDATE ---------------- */

  async update(id: number, data: Partial<Catalogs>): Promise<Catalogs> {
    const catalog = await this.findOne(id);

    Object.assign(catalog, data);
    const updated = await this._catalogsRepo.save(catalog);

    await this.invalidateCatalogCache(id);

    return updated;
  }

  /* ---------------- SOFT DELETE ---------------- */

  async remove(id: number): Promise<void> {
    const catalog = await this.findOne(id);

    await this._catalogsRepo.softRemove(catalog);

    await this.invalidateCatalogCache(id);
  }

  /* ---------------- CACHE INVALIDATION ---------------- */

  private async invalidateCatalogCache(id?: number) {
    const redis: RedisClient = this._redisService.getClient();

    if (id) {
      await redis.del(`catalogs:item:${id}`);
    }

    // SAFE SCAN invalidation
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
}
