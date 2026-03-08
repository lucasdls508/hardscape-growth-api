import { PartialType } from "@nestjs/swagger";
import { CreateMemberDto } from "./CreateAgencyMembers.dto";

export class UpdateMemberDto extends PartialType(CreateMemberDto) {}
