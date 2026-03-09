import { ConfigService } from "@nestjs/config";
import { Queue } from "bullmq";
import { Catalogs } from "src/catalogs/enitities/catalogs.entity";
import { RedisService } from "src/redis/redis.service";
import { Repository } from "typeorm";
import { Logger } from "winston";
import { UpdateEstimateStatusDto } from "./dtos/EstimateStatusUpdate.dto";
import { Estimates, EstimateStatus } from "./entities/estimates.entity";
import { EstimateRendererService } from "./estimate-renderer.service";
import { EstimateCatalogs } from "./estimates_catalogs/entities/estimate_catalogs.entity";
export interface CreateEstimateCatalogItem {
    catalog_id: number;
    quantity: number;
    unit_cost?: number;
    unit_price?: number;
}
export interface CreateEstimateDto {
    prepared_for: string;
    prepared_by: string;
    contructor_signature: string;
    terms_and_conditions: string;
    catalog_items: CreateEstimateCatalogItem[];
}
export declare class EstimatesService {
    private readonly estimatesRepo;
    private readonly estimateCatalogsRepo;
    private readonly catalogsRepo;
    private readonly redisService;
    private readonly leadQueue;
    private readonly renderer;
    private readonly _logger;
    private readonly configService;
    private readonly ITEM_TTL;
    private readonly LIST_TTL;
    private stripe;
    constructor(estimatesRepo: Repository<Estimates>, estimateCatalogsRepo: Repository<EstimateCatalogs>, catalogsRepo: Repository<Catalogs>, redisService: RedisService, leadQueue: Queue, renderer: EstimateRendererService, _logger: Logger, configService: ConfigService);
    estimateNumberGenerator(): Promise<number>;
    renderSignPage(id: number): Promise<string>;
    create(dto: CreateEstimateDto): Promise<Estimates>;
    findByUser(userId: string, page?: number, limit?: number, status?: EstimateStatus, search?: string): Promise<any>;
    findOne(id: number): Promise<any>;
    getCombinedEstimateStatistics(userId: string): Promise<any>;
    updateEstimateStatus(estimateId: number, dto: UpdateEstimateStatusDto): Promise<Estimates>;
    updateLeadSignature(estimateId: number, signature: string): Promise<any>;
    sign(id: number, leadSignature: string): Promise<{
        message: string;
        payment_url?: string;
    }>;
    markDepositPaid(stripeSessionId: string): Promise<{
        id: number;
        prepared_by: string;
    } | null>;
    private invalidateEstimateCache;
    getEstimatesByLead(leadId: string): Promise<any>;
}
