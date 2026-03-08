import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class UpdateLeadSignatureDto {
  @ApiProperty({ example: "Lead Signature Here" })
  @IsString()
  lead_signature: string;
}
