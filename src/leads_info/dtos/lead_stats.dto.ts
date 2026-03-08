import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString } from "class-validator";

export class LeadStatsQueryDto {
  @ApiProperty({
    enum: ["last_week", "last_month", "this_month", "this_year", "previous_year", "month"],
  })
  @IsEnum(["last_week", "last_month", "this_month", "this_year", "previous_year", "month"])
  type: "last_week" | "last_month" | "this_month" | "this_year" | "previous_year" | "month";

  @ApiPropertyOptional({ example: "January" })
  @IsOptional()
  @IsString()
  monthName?: string;

  @ApiPropertyOptional({ enum: ["agency", "contractor"], default: "agency" })
  @IsOptional()
  @IsEnum(["agency", "contractor"])
  role?: "agency" | "contractor";
}
