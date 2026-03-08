import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsNumberString, IsOptional } from "class-validator";

export class GetLeadsQueryDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumberString()
  page?: string;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsNumberString()
  limit?: string;

  @ApiPropertyOptional({ example: "NEW" })
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  is_used?: boolean;
}
