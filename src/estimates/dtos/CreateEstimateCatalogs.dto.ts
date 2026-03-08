import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNumber, IsOptional, Min } from "class-validator";

export class CreateEstimateCatalogItemDto {
  @ApiProperty({ example: 1, description: "Catalog ID" })
  @IsInt()
  catalog_id: number;

  @ApiProperty({ example: 10, description: "Quantity of this item" })
  @IsNumber()
  @Min(0)
  quantity: number;

  @ApiProperty({ example: 5.0, description: "Optional override unit cost", required: false })
  @IsOptional()
  @IsNumber()
  unit_cost?: number;

  @ApiProperty({ example: 10.0, description: "Optional override unit price", required: false })
  @IsOptional()
  @IsNumber()
  unit_price?: number;
}
