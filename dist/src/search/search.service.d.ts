import { ElasticsearchService } from "@nestjs/elasticsearch";
export declare class SearchService {
    private readonly elasticsearchService;
    constructor(elasticsearchService: ElasticsearchService);
    search<T>(index: string, query: Record<string, string>): Promise<import("@elastic/elasticsearch/lib/api/types").SearchResponse<T, Record<string, import("@elastic/elasticsearch/lib/api/types").AggregationsAggregate>>>;
    indexDocument<T>(index: string, id: string, document: any): Promise<import("@elastic/elasticsearch/lib/api/types").WriteResponseBase>;
}
