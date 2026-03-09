import { DataSource } from "typeorm";
import { CreateMemberDto } from "./dto/CreateAgencyMembers.dto";
export declare class ContructorsService {
    private _dataSource;
    constructor(_dataSource: DataSource);
    createMember(createMemberDto: CreateMemberDto, agencyId: string): Promise<{
        ok: boolean;
        message: string;
        data: any;
    }>;
}
