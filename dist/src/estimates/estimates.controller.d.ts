import { User } from "src/user/entities/user.entity";
import { CreateEstimateDto } from "./dtos/CreateEstimate.dto";
import { UpdateEstimateStatusDto } from "./dtos/EstimateStatusUpdate.dto";
import { SignEstimateDto } from "./dtos/signEstimate.dto";
import { UpdateLeadSignatureDto } from "./dtos/UpdateLeadSignature.dto";
import { Estimates, EstimateStatus } from "./entities/estimates.entity";
import { EstimatesService } from "./estimates.service";
export declare class EstimatesController {
    private readonly estimatesService;
    constructor(estimatesService: EstimatesService);
    create(user: User, body: CreateEstimateDto): Promise<Estimates>;
    findByUser(user: User, page: string, limit: string, status: EstimateStatus, searchTerm: string): Promise<any>;
    updateEstimateStatus(id: number, dto: UpdateEstimateStatusDto): Promise<Estimates>;
    getEstimatesByLead(leadId: string): Promise<any>;
    getEstimateStatistics(user: User): Promise<any>;
    findOne(id: number): Promise<Estimates>;
    renderSignPage(id: number, reply: any): Promise<any>;
    sign(id: number, dto: SignEstimateDto): Promise<{
        message: string;
        payment_url?: string;
    }>;
    updateLeadSignature(id: number, body: UpdateLeadSignatureDto): Promise<any>;
}
