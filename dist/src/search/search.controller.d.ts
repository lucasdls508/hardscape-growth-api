import { SearchService } from "./search.service";
export declare class SearchController {
    private readonly _searchService;
    constructor(_searchService: SearchService);
    search(index: string, queryParams: Record<string, any>): Promise<void>;
    indexDocument(index: string, id: string, document: any): Promise<import("@elastic/elasticsearch/lib/api/types").WriteResponseBase>;
}
