// dto/sign-estimate.dto.ts

import { IsNotEmpty, IsString, Matches } from "class-validator";

export class SignEstimateDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^data:image\/(png|jpeg|jpg);base64,/, {
    message: "lead_signature must be a valid base64 image data URL",
  })
  lead_signature: string;
}
