import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString, MaxLength, Min } from "class-validator";

export class CreateCatalogDto {
  @ApiProperty({ example: "Concrete" })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: "High quality concrete" })
  @IsString()
  @MaxLength(500)
  desc: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @Min(0)
  unit: number;

  @ApiProperty({ example: 50.5 })
  @IsNumber()
  @Min(0)
  material_unit_cost: number;

  @ApiProperty({ example: 75.0 })
  @IsNumber()
  @Min(0)
  material_unit_price: number;
}
