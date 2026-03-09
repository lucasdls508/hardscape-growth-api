import { GeminiService } from "./gemini.service";
export declare class GeminiController {
    private readonly geminiService;
    constructor(geminiService: GeminiService);
    analyzeProductImage(file: Express.Multer.File): Promise<{
        status: string;
        statusCode: number;
        data: any;
    }>;
}
