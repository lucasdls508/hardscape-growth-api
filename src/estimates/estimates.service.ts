import { InjectQueue } from "@nestjs/bull";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Queue } from "bullmq";
import Stripe from "stripe";
import { ESTIMATE_SENDING } from "src/appointments/enums/appointments.enum";
import { LEAD_QUEUE_JOB } from "src/bull/processors/leadsQueue";
import { Catalogs } from "src/catalogs/enitities/catalogs.entity";
import { RedisService } from "src/redis/redis.service";
import { InjectLogger } from "src/shared/decorators/logger.decorator";
import { ILike, In, Repository } from "typeorm";
import { Logger } from "winston";
import { UpdateEstimateStatusDto } from "./dtos/EstimateStatusUpdate.dto";
import { Estimates, EstimateStatus } from "./entities/estimates.entity";
import { EstimateRendererService } from "./estimate-renderer.service";
import { EstimateCatalogs } from "./estimates_catalogs/entities/estimate_catalogs.entity";

export interface CreateEstimateCatalogItem {
  catalog_id: number;
  quantity: number;
  unit_cost?: number; // optional override
  unit_price?: number; // optional override
}

export interface CreateEstimateDto {
  prepared_for: string;
  prepared_by: string;
  contructor_signature: string;
  terms_and_conditions: string;
  catalog_items: CreateEstimateCatalogItem[];
}

@Injectable()
export class EstimatesService {
  private readonly ITEM_TTL = 120;
  private readonly LIST_TTL = 60;
  private stripe: Stripe | null = null;

  constructor(
    @InjectRepository(Estimates)
    private readonly estimatesRepo: Repository<Estimates>,
    @InjectRepository(EstimateCatalogs)
    private readonly estimateCatalogsRepo: Repository<EstimateCatalogs>,
    @InjectRepository(Catalogs)
    private readonly catalogsRepo: Repository<Catalogs>,
    private readonly redisService: RedisService,
    @InjectQueue(LEAD_QUEUE_JOB) private readonly leadQueue: Queue,
    private readonly renderer: EstimateRendererService,
    @InjectLogger() private readonly _logger: Logger,
    private readonly configService: ConfigService
  ) {
    const stripeKey = configService.get<string>("STRIPE_SECRET_KEY");
    if (stripeKey) {
      this.stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    }
  }

  async estimateNumberGenerator() {
    const redis = await this.redisService.getClient();

    const exists = await redis.exists("estimate_no");
    if (!exists) {
      await redis.set("estimate_no", 1000); // next INCR → 115
    }

    const estimateNo = await redis.incr("estimate_no");
    return estimateNo;
  }
  async renderSignPage(id: number): Promise<string> {
    const estimate = await this.estimatesRepo.findOne({
      where: { id },
      relations: ["estimate_catalogs", "estimate_catalogs.catalog", "prepared_by_user", "lead"],
    });
    if (!estimate) throw new NotFoundException(`Estimate #${id} not found`);

    return this.renderer.render(estimate);
  }
  /* ----------------------------------------
   * CREATE ESTIMATE + ESTIMATE CATALOGS
   * --------------------------------------*/
  async create(dto: CreateEstimateDto): Promise<Estimates> {
    // 1️⃣ Fetch all catalogs to validate existence and prices
    const catalogIds = dto.catalog_items.map((c) => c.catalog_id);
    const catalogs = await this.catalogsRepo.findBy({ id: In(catalogIds) });

    if (catalogs.length !== catalogIds.length) {
      throw new BadRequestException("Some catalog items are invalid");
    }

    // 2️⃣ Create estimate entity
    const estimate = this.estimatesRepo.create({
      prepared_for: dto.prepared_for,
      prepared_by: dto.prepared_by,
      contructor_signature: dto.contructor_signature || null,
      estimate_no: await this.estimateNumberGenerator(),
      terms_and_conditions: dto.terms_and_conditions,
    });

    const savedEstimate = await this.estimatesRepo.save(estimate);

    // 3️⃣ Create estimate catalogs
    const estimateCatalogEntities = dto.catalog_items.map((item) => {
      const catalog = catalogs.find((c) => c.id === item.catalog_id);

      // Apply business logic: use catalog defaults if not provided
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

    // 4️⃣ Invalidate related caches
    await this.invalidateEstimateCache(savedEstimate.id, savedEstimate.prepared_by);

    // 5️⃣ Return full estimate with catalogs
    const estim = await this.estimatesRepo.findOne({
      where: { id: savedEstimate.id },
      relations: ["estimate_catalogs", "estimate_catalogs.catalog", "prepared_by_user", "lead"],
    });

    await this.leadQueue.add(ESTIMATE_SENDING, {
      leadId: estim.lead.id,
      estimates: `${this.configService.get("WEBHOOK_URL")}/estimates/${savedEstimate.id}/sign`,
      user: estim.prepared_by_user,
    });

    return estim;
  }

  /* ----------------------------------------
   * GET ESTIMATES BY USER (PAGINATION)
   * --------------------------------------*/
  async findByUser(userId: string, page = 1, limit = 10, status?: EstimateStatus, search?: string) {
    const cacheKey = `estimates:list:user:${userId}:page:${page}:limit:${limit}`;

    const cached = await this.redisService.getCache(cacheKey);
    if (cached) return cached;

    const where: any = {
      prepared_by: userId,
      deletedAt: null,
    };
    if (status) {
      where.status = status;
    }
    if (search) {
      where.prepared_for.name = ILike(search);
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

  /* ----------------------------------------
   * GET SINGLE ESTIMATE
   * --------------------------------------*/
  async findOne(id: number) {
    const cacheKey = `estimate:item:${id}`;

    const cached = await this.redisService.getCache(cacheKey);
    if (cached) return cached;

    const estimate = await this.estimatesRepo.findOne({
      where: { id, deletedAt: null },
      relations: ["estimate_catalogs", "estimate_catalogs.catalog"],
    });

    if (!estimate) throw new NotFoundException("Estimate not found");

    await this.redisService.setCacheWithTTL(cacheKey, estimate, this.ITEM_TTL);

    return estimate;
  }

  async getCombinedEstimateStatistics(userId: string) {
    const cacheKey = `estimates:stats:combined`;

    // 1️⃣ Check Redis
    const cached = await this.redisService.get(cacheKey);
    if (cached) return cached;

    // 2️⃣ Total estimates
    const totalEstimates = await this.estimatesRepo.count();

    // 3️⃣ Estimates grouped by status
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

    // 4️⃣ Leads grouped by lead.status
    const leadStatusRaw = await this.estimatesRepo
      .createQueryBuilder("estimate")
      .leftJoin("estimate.lead", "lead")
      .select("lead.status", "status")
      .addSelect("COUNT(DISTINCT lead.id)", "count") // count unique leads
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

    // 5️⃣ Cache
    await this.redisService.set(cacheKey, result, this.LIST_TTL);

    return result;
  }

  /* ----------------------------------------
   * UPDATE LEAD SIGNATURE
   * --------------------------------------*/

  async updateEstimateStatus(estimateId: number, dto: UpdateEstimateStatusDto): Promise<Estimates> {
    const estimate = await this.estimatesRepo.findOne({ where: { id: estimateId } });
    if (!estimate) throw new NotFoundException("Estimate not found");

    estimate.status = dto.status;

    const updated = await this.estimatesRepo.save(estimate);

    // Optional: Invalidate Redis cache for statistics
    await this.redisService.del("estimates:stats:combined");
    await this.redisService.del(`estimates:lead:${estimate.prepared_for}`);

    return updated;
  }
  async updateLeadSignature(estimateId: number, signature: string) {
    const estimate = await this.findOne(estimateId);

    estimate.lead_signature = signature;
    const updated = await this.estimatesRepo.save(estimate);

    await this.invalidateEstimateCache(estimateId, estimate.prepared_by);

    return updated;
  }

  // ─── SIGN ────────────────────────────────────────────────────────────────────
  async sign(id: number, leadSignature: string): Promise<{ message: string; payment_url?: string }> {
    const estimate = await this.estimatesRepo.findOne({
      where: { id },
      relations: ["estimate_catalogs"],
    });
    if (!estimate) throw new NotFoundException(`Estimate #${id} not found`);
    if (estimate.lead_signature) {
      throw new BadRequestException("This estimate has already been signed");
    }

    await this.estimatesRepo.update(id, { lead_signature: leadSignature });
    this._logger.log(`Estimate #${id} signed by lead`, EstimatesService.name);

    // Generate 10% deposit Stripe Checkout session
    if (this.stripe && estimate.estimate_catalogs?.length) {
      try {
        const total = estimate.estimate_catalogs.reduce(
          (sum, item) => sum + Number(item.unit_price) * Number(item.quantity),
          0
        );
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
      } catch (err) {
        this._logger.error(`Failed to create Stripe deposit session for estimate #${id}`, err);

        // Dev-mode fallback: generate a local mock session so the payment loop is testable
        // without real Stripe credentials (non-production only)
        if (this.configService.get<string>("NODE_ENV") !== "production") {
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

  // ─── MARK DEPOSIT PAID ───────────────────────────────────────────────────────
  async markDepositPaid(
    stripeSessionId: string
  ): Promise<{ id: number; prepared_by: string } | null> {
    const estimate = await this.estimatesRepo.findOne({
      where: { stripe_session_id: stripeSessionId },
    });

    if (!estimate) {
      this._logger.warn(`[Stripe] No estimate found for session ${stripeSessionId}`);
      return null;
    }

    await this.estimatesRepo.update(estimate.id, { status: EstimateStatus.DEPOSIT_PAID });
    await this.invalidateEstimateCache(estimate.id, estimate.prepared_by);

    this._logger.warn(`Estimate #${estimate.id} marked deposit_paid via Stripe session ${stripeSessionId}`);
    return { id: estimate.id, prepared_by: estimate.prepared_by };
  }

  /* ----------------------------------------
   * CACHE INVALIDATION
   * --------------------------------------*/
  private async invalidateEstimateCache(estimateId?: number, userId?: string) {
    const redis = this.redisService.getClient();

    if (estimateId) {
      await redis.del(`estimate:item:${estimateId}`);
    }

    if (userId) {
      // Invalidate all paginated lists for this user
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
  async getEstimatesByLead(leadId: string) {
    const cacheKey = `estimates:lead:${leadId}`;

    // 1️⃣ Check Redis
    const cached = await this.redisService.get(cacheKey);
    if (cached) {
      return cached;
    }

    // 2️⃣ Fetch from DB
    const estimates = await this.estimatesRepo.find({
      where: { prepared_for: leadId },
      relations: ["prepared_by_user", "estimate_catalogs", "estimate_catalogs.catalog"],
      order: { createdAt: "DESC" },
    });

    // 3️⃣ Cache (optional)
    await this.redisService.set(cacheKey, estimates, this.LIST_TTL);

    return estimates;
  }
}
