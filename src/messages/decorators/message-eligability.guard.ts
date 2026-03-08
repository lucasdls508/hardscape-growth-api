import { ExecutionContext, Injectable } from "@nestjs/common";
import { LeadsInfoService } from "src/leads_info/leads_info.service";
import { PageSessionService } from "src/page_session/page_session.service";
import { ParticipantsService } from "src/participants/participants.service";

@Injectable()
export class MessageEligabilityGuard {
  constructor(
    private readonly participantService: ParticipantsService,
    private readonly _pageSessionService: PageSessionService,
    private readonly _leadService: LeadsInfoService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const params = request.body.conversation_id || request.params.id; // Get conversation ID from either body or params
    // Ensure the user is authenticated
    const participants = await this.participantService.getParticipants(parseFloat(params));
    // console.log(participants)
    const eligable = true;

    // const receiver = null;

    // for (const participant of participants) {
    //   if (participant.user.id === user.id) {
    //     eligable = true;
    //     request.conversation = participant.conversation; // Assuming the first participant's conversation is the one we want
    //   } else {
    //     receiver = participant.user;
    //   }
    // }

    // if (!eligable) {
    //   throw new UnauthorizedException("You are not part of this conversation!");
    // }
    request.receiver = participants;

    return eligable; // Return true if eligible, else false
  }
}
