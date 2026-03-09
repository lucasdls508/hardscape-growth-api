import { OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Estimates } from "./entities/estimates.entity";
export declare class EstimateRendererService implements OnModuleInit {
    private readonly config;
    private readonly logger;
    private compiledTemplate;
    constructor(config: ConfigService);
    onModuleInit(): void;
    render(estimate: Estimates): string;
}
