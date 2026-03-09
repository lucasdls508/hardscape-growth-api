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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var EstimatesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EstimatesService = void 0;
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const bullmq_1 = require("bullmq");
const stripe_1 = __importDefault(require("stripe"));
const appointments_enum_1 = require("../appointments/enums/appointments.enum");
const leadsQueue_1 = require("../bull/processors/leadsQueue");
const catalogs_entity_1 = require("../catalogs/enitities/catalogs.entity");
const redis_service_1 = require("../redis/redis.service");
const logger_decorator_1 = require("../shared/decorators/logger.decorator");
const typeorm_2 = require("typeorm");
const winston_1 = require("winston");
const estimates_entity_1 = require("./entities/estimates.entity");
const estimate_renderer_service_1 = require("./estimate-renderer.service");
const estimate_catalogs_entity_1 = require("./estimates_catalogs/entities/estimate_catalogs.entity");
let EstimatesService = EstimatesService_1 = class EstimatesService {
    constructor(estimatesRepo, estimateCatalogsRepo, catalogsRepo, redisService, leadQueue, renderer, _logger, configService) {
        this.estimatesRepo = estimatesRepo;
        this.estimateCatalogsRepo = estimateCatalogsRepo;
        this.catalogsRepo = catalogsRepo;
        this.redisService = redisService;
        this.leadQueue = leadQueue;
        this.renderer = renderer;
        this._logger = _logger;
        this.configService = configService;
        this.ITEM_TTL = 120;
        this.LIST_TTL = 60;
        this.stripe = null;
        const stripeKey = configService.get("STRIPE_SECRET_KEY");
        if (stripeKey) {
            this.stripe = new stripe_1.default(stripeKey, { apiVersion: "2025-08-27.basil" });
        }
    }
    async estimateNumberGenerator() {
        const redis = await this.redisService.getClient();
        const exists = await redis.exists("estimate_no");
        if (!exists) {
            await redis.set("estimate_no", 1000);
        }
        const estimateNo = await redis.incr("estimate_no");
        return estimateNo;
    }
    async renderSignPage(id) {
        const estimate = await this.estimatesRepo.findOne({
            where: { id },
            relations: ["estimate_catalogs", "estimate_catalogs.catalog", "prepared_by_user", "lead"],
        });
        if (!estimate)
            throw new common_1.NotFoundException(`Estimate #${id} not found`);
        return this.renderer.render(estimate);
    }
    async create(dto) {
        const catalogIds = dto.catalog_items.map((c) => c.catalog_id);
        const catalogs = await this.catalogsRepo.findBy({ id: (0, typeorm_2.In)(catalogIds) });
        if (catalogs.length !== catalogIds.length) {
            throw new common_1.BadRequestException("Some catalog items are invalid");
        }
        const estimate = this.estimatesRepo.create({
            prepared_for: dto.prepared_for,
            prepared_by: dto.prepared_by,
            contructor_signature: dto.contructor_signature || null,
            estimate_no: await this.estimateNumberGenerator(),
            terms_and_conditions: dto.terms_and_conditions,
        });
        const savedEstimate = await this.estimatesRepo.save(estimate);
        const estimateCatalogEntities = dto.catalog_items.map((item) => {
            const catalog = catalogs.find((c) => c.id === item.catalog_id);
            const unit_cost = item.unit_cost ?? catalog.material_unit_cost;
            const unit_price = item.unit_price ?? catalog.material_unit_price;
            return this.estimateCatalogsRepo.create({
                estimate_id: savedEstimate.id,
                catalog_id: catalog.id,
                quantity: item.quantity,
                unit_cost,
                unit_price,
            });
        });
        await this.estimateCatalogsRepo.save(estimateCatalogEntities);
        await this.invalidateEstimateCache(savedEstimate.id, savedEstimate.prepared_by);
        const estim = await this.estimatesRepo.findOne({
            where: { id: savedEstimate.id },
            relations: ["estimate_catalogs", "estimate_catalogs.catalog", "prepared_by_user", "lead"],
        });
        await this.leadQueue.add(appointments_enum_1.ESTIMATE_SENDING, {
            leadId: estim.lead.id,
            estimates: `${this.configService.get("WEBHOOK_URL")}/estimates/${savedEstimate.id}/sign`,
            user: estim.prepared_by_user,
        });
        return estim;
    }
    async findByUser(userId, page = 1, limit = 10, status, search) {
        const cacheKey = `estimates:list:user:${userId}:page:${page}:limit:${limit}`;
        const cached = await this.redisService.getCache(cacheKey);
        if (cached)
            return cached;
        const where = {
            prepared_by: userId,
            deletedAt: null,
        };
        if (status) {
            where.status = status;
        }
        if (search) {
            where.prepared_for.name = (0, typeorm_2.ILike)(search);
        }
        const [data, total] = await this.estimatesRepo.findAndCount({
            where,
            relations: ["estimate_catalogs", "estimate_catalogs.catalog", "lead"],
            order: { createdAt: "DESC" },
            skip: (page - 1) * limit,
            take: limit,
        });
        const result = { data, total, page, limit };
        await this.redisService.setCacheWithTTL(cacheKey, result, this.LIST_TTL);
        return result;
    }
    async findOne(id) {
        const cacheKey = `estimate:item:${id}`;
        const cached = await this.redisService.getCache(cacheKey);
        if (cached)
            return cached;
        const estimate = await this.estimatesRepo.findOne({
            where: { id, deletedAt: null },
            relations: ["estimate_catalogs", "estimate_catalogs.catalog"],
        });
        if (!estimate)
            throw new common_1.NotFoundException("Estimate not found");
        await this.redisService.setCacheWithTTL(cacheKey, estimate, this.ITEM_TTL);
        return estimate;
    }
    async getCombinedEstimateStatistics(userId) {
        const cacheKey = `estimates:stats:combined`;
        const cached = await this.redisService.get(cacheKey);
        if (cached)
            return cached;
        const totalEstimates = await this.estimatesRepo.count();
        const estimatesByStatusRaw = await this.estimatesRepo
            .createQueryBuilder("estimate")
            .select("estimate.status", "status")
            .addSelect("COUNT(estimate.id)", "count")
            .groupBy("estimate.status")
            .where("estimate.prepared_by = :userId", { userId })
            .getRawMany();
        const estimatesByStatus = estimatesByStatusRaw.map((item) => ({
            status: item.status,
            count: Number(item.count),
        }));
        const leadStatusRaw = await this.estimatesRepo
            .createQueryBuilder("estimate")
            .leftJoin("estimate.lead", "lead")
            .select("lead.status", "status")
            .addSelect("COUNT(DISTINCT lead.id)", "count")
            .where("estimate.prepared_by = :userId", { userId })
            .groupBy("lead.status")
            .getRawMany();
        const leadStatus = leadStatusRaw.map((item) => ({
            status: item.status,
            count: Number(item.count),
        }));
        const result = {
            total_estimates: totalEstimates,
            by_status: estimatesByStatus,
            lead_status: leadStatus,
        };
        await this.redisService.set(cacheKey, result, this.LIST_TTL);
        return result;
    }
    async updateEstimateStatus(estimateId, dto) {
        const estimate = await this.estimatesRepo.findOne({ where: { id: estimateId } });
        if (!estimate)
            throw new common_1.NotFoundException("Estimate not found");
        estimate.status = dto.status;
        const updated = await this.estimatesRepo.save(estimate);
        await this.redisService.del("estimates:stats:combined");
        await this.redisService.del(`estimates:lead:${estimate.prepared_for}`);
        return updated;
    }
    async updateLeadSignature(estimateId, signature) {
        const estimate = await this.findOne(estimateId);
        estimate.lead_signature = signature;
        const updated = await this.estimatesRepo.save(estimate);
        await this.invalidateEstimateCache(estimateId, estimate.prepared_by);
        return updated;
    }
    async sign(id, leadSignature) {
        const estimate = await this.estimatesRepo.findOne({
            where: { id },
            relations: ["estimate_catalogs"],
        });
        if (!estimate)
            throw new common_1.NotFoundException(`Estimate #${id} not found`);
        if (estimate.lead_signature) {
            throw new common_1.BadRequestException("This estimate has already been signed");
        }
        await this.estimatesRepo.update(id, { lead_signature: leadSignature });
        this._logger.log(`Estimate #${id} signed by lead`, EstimatesService_1.name);
        if (this.stripe && estimate.estimate_catalogs?.length) {
            try {
                const total = estimate.estimate_catalogs.reduce((sum, item) => sum + Number(item.unit_price) * Number(item.quantity), 0);
                const depositCents = Math.round(total * 0.1 * 100);
                if (depositCents > 0) {
                    const session = await this.stripe.checkout.sessions.create({
                        payment_method_types: ["card"],
                        line_items: [
                            {
                                price_data: {
                                    currency: "usd",
                                    product_data: { name: `Deposit for Estimate #${estimate.estimate_no}` },
                                    unit_amount: depositCents,
                                },
                                quantity: 1,
                            },
                        ],
                        metadata: { estimate_id: String(id) },
                        mode: "payment",
                        success_url: `${this.configService.get("FR_BASE_URL")}/estimates/${id}/thank-you`,
                        cancel_url: `${this.configService.get("FR_BASE_URL")}/estimates/${id}/sign`,
                    });
                    await this.estimatesRepo.update(id, {
                        stripe_session_id: session.id,
                        stripe_payment_url: session.url,
                    });
                    await this.invalidateEstimateCache(id, estimate.prepared_by);
                    return { message: "Estimate signed successfully", payment_url: session.url };
                }
            }
            catch (err) {
                this._logger.error(`Failed to create Stripe deposit session for estimate #${id}`, err);
                if (this.configService.get("NODE_ENV") !== "production") {
                    const mockSessionId = `cs_test_dev_${Date.now()}_est${id}`;
                    const mockPaymentUrl = `${this.configService.get("FR_BASE_URL")}/estimates/${id}/dev-checkout?session=${mockSessionId}`;
                    await this.estimatesRepo.update(id, {
                        stripe_session_id: mockSessionId,
                        stripe_payment_url: mockPaymentUrl,
                    });
                    await this.invalidateEstimateCache(id, estimate.prepared_by);
                    this._logger.warn(`[Dev] Mock Stripe session created for estimate #${id}: ${mockSessionId}`);
                    return { message: "Estimate signed successfully", payment_url: mockPaymentUrl };
                }
            }
        }
        return { message: "Estimate signed successfully" };
    }
    async markDepositPaid(stripeSessionId) {
        const estimate = await this.estimatesRepo.findOne({
            where: { stripe_session_id: stripeSessionId },
        });
        if (!estimate) {
            this._logger.warn(`[Stripe] No estimate found for session ${stripeSessionId}`);
            return null;
        }
        await this.estimatesRepo.update(estimate.id, { status: estimates_entity_1.EstimateStatus.DEPOSIT_PAID });
        await this.invalidateEstimateCache(estimate.id, estimate.prepared_by);
        this._logger.warn(`Estimate #${estimate.id} marked deposit_paid via Stripe session ${stripeSessionId}`);
        return { id: estimate.id, prepared_by: estimate.prepared_by };
    }
    async invalidateEstimateCache(estimateId, userId) {
        const redis = this.redisService.getClient();
        if (estimateId) {
            await redis.del(`estimate:item:${estimateId}`);
        }
        if (userId) {
            let cursor = 0;
            do {
                const { cursor: nextCursor, keys } = await redis.scan(cursor, {
                    MATCH: `estimates:list:user:${userId}:*`,
                    COUNT: 100,
                });
                if (keys.length) {
                    await redis.del(keys);
                }
                cursor = nextCursor;
            } while (cursor !== 0);
        }
    }
    async getEstimatesByLead(leadId) {
        const cacheKey = `estimates:lead:${leadId}`;
        const cached = await this.redisService.get(cacheKey);
        if (cached) {
            return cached;
        }
        const estimates = await this.estimatesRepo.find({
            where: { prepared_for: leadId },
            relations: ["prepared_by_user", "estimate_catalogs", "estimate_catalogs.catalog"],
            order: { createdAt: "DESC" },
        });
        await this.redisService.set(cacheKey, estimates, this.LIST_TTL);
        return estimates;
    }
};
exports.EstimatesService = EstimatesService;
exports.EstimatesService = EstimatesService = EstimatesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(estimates_entity_1.Estimates)),
    __param(1, (0, typeorm_1.InjectRepository)(estimate_catalogs_entity_1.EstimateCatalogs)),
    __param(2, (0, typeorm_1.InjectRepository)(catalogs_entity_1.Catalogs)),
    __param(4, (0, bull_1.InjectQueue)(leadsQueue_1.LEAD_QUEUE_JOB)),
    __param(6, (0, logger_decorator_1.InjectLogger)()),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        redis_service_1.RedisService,
        bullmq_1.Queue,
        estimate_renderer_service_1.EstimateRendererService,
        winston_1.Logger,
        config_1.ConfigService])
], EstimatesService);
//# sourceMappingURL=estimates.service.js.map