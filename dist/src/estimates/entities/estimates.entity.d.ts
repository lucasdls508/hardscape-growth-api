import { Lead } from "src/leads_info/entities/lead.entity";
import { User } from "src/user/entities/user.entity";
import { EstimateCatalogs } from "../estimates_catalogs/entities/estimate_catalogs.entity";
export declare enum EstimateStatus {
    UN_SIGNED = "unsigned",
    CANCELED = "canceled",
    CONFIRMED = "confirmed",
    DEPOSIT_PAID = "deposit_paid"
}
export declare class Estimates {
    id: number;
    estimate_no: number;
    prepared_for: string;
    prepared_by: string;
    lead: Lead;
    prepared_by_user: User;
    estimate_catalogs: EstimateCatalogs[];
    terms_and_conditions: string;
    contructor_signature: string;
    lead_signature: string;
    status: EstimateStatus;
    stripe_session_id: string;
    stripe_payment_url: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
