export declare class LeadStatsQueryDto {
    type: "last_week" | "last_month" | "this_month" | "this_year" | "previous_year" | "month";
    monthName?: string;
    role?: "agency" | "contractor";
}
