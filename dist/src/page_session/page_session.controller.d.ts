import { UpdateMetaBusinessProfileDto } from "./dto/update_meta_buisness_profile.dto";
import { MetaBuisnessProfiles } from "./entites/meta_buisness.entity";
import { PageSessionService } from "./page_session.service";
export declare class PageSessionController {
    private readonly _metaBusinessProfilesService;
    constructor(_metaBusinessProfilesService: PageSessionService);
    findByPage(page_id: string, user_id: string): Promise<{
        ok: boolean;
        message: string;
        data: MetaBuisnessProfiles;
    }>;
    retriveAll(): Promise<{
        message: string;
        data: import("./types/buisness.types").FacebookPage[];
        ok: boolean;
    }>;
    findByPageId(pageId: string): Promise<MetaBuisnessProfiles>;
    update(id: number, updateProfileDto: UpdateMetaBusinessProfileDto): Promise<MetaBuisnessProfiles>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
