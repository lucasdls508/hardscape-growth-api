"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const swagger_1 = require("@nestjs/swagger");
const bull_1 = require("@nestjs/bull");
const process_1 = __importDefault(require("process"));
const node_os_1 = __importDefault(require("node:os"));
const rxjs_1 = require("rxjs");
let AppController = class AppController {
    constructor(appService, myQueue) {
        this.appService = appService;
        this.myQueue = myQueue;
        this.systemInfo$ = new rxjs_1.Subject();
        (0, rxjs_1.interval)(2000).subscribe(() => {
            const data = this.getSystemInfo();
            this.systemInfo$.next(data);
        });
    }
    async get() {
        console.trace("call stack");
        structuredClone({ name: "Iftekhar" });
        return { msg: "Hello world" };
    }
    async getCSRFToken(req) {
        return { csrfToken: req.csrfToken?.() };
    }
    getSystemInfo() {
        const totalMem = node_os_1.default.totalmem();
        const freeMem = node_os_1.default.freemem();
        const usedMem = totalMem - freeMem;
        const memoryUsagePercent = ((usedMem / totalMem) * 100).toFixed(2);
        const cpuInfo = node_os_1.default.cpus();
        const avgLoad = node_os_1.default.loadavg();
        const memUsage = process_1.default.memoryUsage();
        const heapUsedMB = (memUsage.heapUsed / 1024 / 1024).toFixed(2);
        const heapTotalMB = (memUsage.heapTotal / 1024 / 1024).toFixed(2);
        const rssMB = (memUsage.rss / 1024 / 1024).toFixed(2);
        const cpuPercentages = cpuInfo.map((cpu, index) => {
            const times = cpu.times;
            const total = Object.values(times).reduce((acc, tv) => acc + tv, 0);
            const idle = times.idle;
            const usagePercent = (((total - idle) / total) * 100).toFixed(2);
            return {
                core: index,
                model: cpu.model,
                speedMHz: cpu.speed,
                usagePercent,
            };
        });
        const uptimeInSeconds = node_os_1.default.uptime();
        const uptimeDays = Math.floor(uptimeInSeconds / (24 * 60 * 60));
        const uptimeHours = Math.floor((uptimeInSeconds % (24 * 60 * 60)) / 3600);
        return {
            hostname: node_os_1.default.hostname(),
            uptime: {
                days: uptimeDays,
                hours: uptimeHours,
                raw: uptimeInSeconds,
            },
            loadAverage: avgLoad,
            memory: {
                totalMB: (totalMem / (1024 * 1024)).toFixed(2),
                usedMB: (usedMem / (1024 * 1024)).toFixed(2),
                freeMB: (freeMem / (1024 * 1024)).toFixed(2),
                usagePercent: memoryUsagePercent,
            },
            nodeMemory: {
                heapUsedMB,
                heapTotalMB,
                rssMB,
            },
            networkInterfaces: node_os_1.default.networkInterfaces(),
            cpu: {
                cores: cpuInfo.length,
                details: cpuPercentages,
            },
        };
    }
    systemInfoStream() {
        let count = 0;
        return this.systemInfo$.pipe((0, rxjs_1.map)(() => {
            console.log(`Streaming ${count++}`);
            const totalMem = node_os_1.default.totalmem();
            const memUsage = process_1.default.memoryUsage();
            const freeMem = node_os_1.default.freemem();
            const usedMem = totalMem - freeMem;
            const memoryUsagePercent = ((usedMem / totalMem) * 100).toFixed(2);
            const heapUsedMB = (memUsage.heapUsed / 1024 / 1024).toFixed(2);
            const heapTotalMB = (memUsage.heapTotal / 1024 / 1024).toFixed(2);
            const rssMB = (memUsage.rss / 1024 / 1024).toFixed(2);
            const cpuInfo = node_os_1.default.cpus();
            const avgLoad = node_os_1.default.loadavg();
            const cpuPercentages = cpuInfo.map((cpu, index) => {
                const times = cpu.times;
                const total = Object.values(times).reduce((acc, tv) => acc + tv, 0);
                const idle = times.idle;
                const usagePercent = (((total - idle) / total) * 100).toFixed(2);
                return {
                    core: index,
                    model: cpu.model,
                    speedMHz: cpu.speed,
                    usagePercent,
                };
            });
            const uptimeInSeconds = node_os_1.default.uptime();
            const uptimeDays = Math.floor(uptimeInSeconds / (24 * 60 * 60));
            const uptimeHours = Math.floor((uptimeInSeconds % (24 * 60 * 60)) / 3600);
            return {
                data: {
                    hostname: node_os_1.default.hostname(),
                    uptime: {
                        days: uptimeDays,
                        hours: uptimeHours,
                        raw: uptimeInSeconds,
                    },
                    nodeMemory: {
                        heapUsedMB,
                        heapTotalMB,
                        rssMB,
                    },
                    loadAverage: avgLoad,
                    memory: {
                        totalMB: (totalMem / (1024 * 1024)).toFixed(2),
                        usedMB: (usedMem / (1024 * 1024)).toFixed(2),
                        freeMB: (freeMem / (1024 * 1024)).toFixed(2),
                        usagePercent: memoryUsagePercent,
                    },
                    networkInterfaces: node_os_1.default.networkInterfaces(),
                    cpu: {
                        cores: cpuInfo.length,
                        details: cpuPercentages,
                    },
                },
            };
        }));
    }
    async addJob() {
        const job = await this.myQueue.add("job", {
            message: "This is the job data",
        });
        return `Job with ID ${job.id} has been added to the queue.`;
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(""),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "get", null);
__decorate([
    (0, common_1.Get)("csrf-token"),
    (0, swagger_1.ApiTags)("CSRF"),
    (0, swagger_1.ApiOperation)({
        description: "Generate CSRF Token",
        summary: "Generate CSRF Token to be used in Frontend Forms",
    }),
    (0, swagger_1.ApiOkResponse)({
        description: "Generate CSRF Token",
        example: {
            csrfToken: "MHP1Skkd-QJhgDlYvqFda4RIgocjDd4_gh3U",
        },
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getCSRFToken", null);
__decorate([
    (0, common_1.Get)("system-info"),
    (0, common_1.Render)("system-info"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getSystemInfo", null);
__decorate([
    (0, common_1.Sse)("stream"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", rxjs_1.Observable)
], AppController.prototype, "systemInfoStream", null);
__decorate([
    (0, common_1.Get)("add-job"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "addJob", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __param(1, (0, bull_1.InjectQueue)("myQueue")),
    __metadata("design:paramtypes", [app_service_1.AppService, Object])
], AppController);
//# sourceMappingURL=app.controller.js.map