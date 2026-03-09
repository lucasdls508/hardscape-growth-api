import { Repository } from "typeorm";
import { Setting } from "./entity/settings.entity";
export declare class SettingsService {
    private readonly _settingsRepo;
    constructor(_settingsRepo: Repository<Setting>);
    getSettingByKey(key: string): Promise<Setting>;
    getRawSettingKey(key: string): Promise<string>;
    updateSetting(key: string, content: string): Promise<Setting>;
    getAll(): Promise<Setting[]>;
}
