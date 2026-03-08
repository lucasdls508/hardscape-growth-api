import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { EstimateStatus } from "../entities/estimates.entity";

export class UpdateEstimateStatusDto {
  @ApiProperty({ enum: EstimateStatus, description: "New status of the estimate" })
  @IsEnum(EstimateStatus, { message: "Invalid estimate status" })
  status: EstimateStatus;
}
