import { LeadsInfoService } from "src/leads_info/leads_info.service";
import { SettingsService } from "src/settings/settings.service";
import { UserService } from "src/user/user.service";
import { DataSource } from "typeorm";
export declare class SeederService {
    private readonly _userService;
    private readonly _dataSource;
    private readonly _leadsInfo;
    private readonly settingService;
    constructor(_userService: UserService, _dataSource: DataSource, _leadsInfo: LeadsInfoService, settingService: SettingsService);
    seedAdminUser(): Promise<void>;
    seedFakeUsers(): Promise<{
        message: string;
    }>;
    seedSettings(): Promise<void>;
    seedLeeds(): Promise<void>;
}
