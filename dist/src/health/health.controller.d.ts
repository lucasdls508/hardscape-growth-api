import { ConfigService } from "@nestjs/config";
import { HealthCheckService, MemoryHealthIndicator, TypeOrmHealthIndicator } from "@nestjs/terminus";
import { MetricsService } from "./matrics.service";
export declare class HealthController {
    private health;
    private dbSQL;
    private memory;
    private configService;
    private readonly metricsService;
    private readonly register;
    constructor(health: HealthCheckService, dbSQL: TypeOrmHealthIndicator, memory: MemoryHealthIndicator, configService: ConfigService, metricsService: MetricsService);
    checkDatabase(): Promise<import("@nestjs/terminus").HealthCheckResult>;
    checkMemory(): Promise<import("@nestjs/terminus").HealthCheckResult>;
    getMetrics(): Promise<string>;
}
