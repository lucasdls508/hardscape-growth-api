export declare class MetricsService {
    private httpRequestsTotal;
    constructor();
    incrementHttpRequests(method: string, route: string, status: string): void;
    getMetrics(): Promise<string>;
}
