import { Lead } from "src/leads_info/entities/lead.entity";
import { Repository } from "typeorm";
export declare class LeadSeedService {
    private readonly leadRepository;
    private readonly logger;
    constructor(leadRepository: Repository<Lead>);
    seed(count?: number): Promise<void>;
    clear(): Promise<void>;
    reseed(count?: number): Promise<void>;
}
