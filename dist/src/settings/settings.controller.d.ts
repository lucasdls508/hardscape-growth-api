import { SettingsService } from "./settings.service";
export declare class SettingsController {
    private readonly _settingsService;
    constructor(_settingsService: SettingsService);
    getInstruction(): {
        title: string;
        content: string;
    };
    getAll(): Promise<import("./entity/settings.entity").Setting[]>;
    getByKey(key: string): Promise<import("./entity/settings.entity").Setting>;
    getPrivacyPolicy(key: string): Promise<{
        content: string;
    }>;
    updateSetting(key: string, content: string): Promise<import("./entity/settings.entity").Setting>;
}
