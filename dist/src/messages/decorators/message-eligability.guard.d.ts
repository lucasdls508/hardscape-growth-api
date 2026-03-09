import { ExecutionContext } from "@nestjs/common";
import { LeadsInfoService } from "src/leads_info/leads_info.service";
import { PageSessionService } from "src/page_session/page_session.service";
import { ParticipantsService } from "src/participants/participants.service";
export declare class MessageEligabilityGuard {
    private readonly participantService;
    private readonly _pageSessionService;
    private readonly _leadService;
    constructor(participantService: ParticipantsService, _pageSessionService: PageSessionService, _leadService: LeadsInfoService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
