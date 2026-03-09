import { Job } from "bull";
export declare class BullQueueProcessor {
    handleJob(job: Job): Promise<void>;
    doSomeWork(data: any): Promise<void>;
}
