export interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}
export declare function pagination({ page, limit, total }: {
    page: number;
    limit: number;
    total: number;
}): {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
};
