import { AppService } from "./app.service";
import { Request } from "express";
import { Queue } from "bull";
import os from "node:os";
import { Observable } from "rxjs";
export declare class AppController {
    private readonly appService;
    private readonly myQueue;
    private systemInfo$;
    constructor(appService: AppService, myQueue: Queue);
    get(): Promise<{
        msg: string;
    }>;
    getCSRFToken(req: Request): Promise<{
        csrfToken: string;
    }>;
    getSystemInfo(): {
        hostname: string;
        uptime: {
            days: number;
            hours: number;
            raw: number;
        };
        loadAverage: number[];
        memory: {
            totalMB: string;
            usedMB: string;
            freeMB: string;
            usagePercent: string;
        };
        nodeMemory: {
            heapUsedMB: string;
            heapTotalMB: string;
            rssMB: string;
        };
        networkInterfaces: NodeJS.Dict<os.NetworkInterfaceInfo[]>;
        cpu: {
            cores: number;
            details: {
                core: number;
                model: string;
                speedMHz: number;
                usagePercent: string;
            }[];
        };
    };
    systemInfoStream(): Observable<MessageEvent>;
    addJob(): Promise<string>;
}
