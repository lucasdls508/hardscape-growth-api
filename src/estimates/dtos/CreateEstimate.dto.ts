import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayMinSize, IsString, IsUUID, ValidateNested } from "class-validator";
import { CreateEstimateCatalogItemDto } from "./CreateEstimateCatalogs.dto";
export class CreateEstimateDto {
  @ApiProperty({ example: "a1b2c3d4-uuid", description: "UUID of the lead/customer" })
  @IsUUID()
  prepared_for: string;

  @ApiProperty({ example: "Terms and conditions go here..." })
  @IsString()
  terms_and_conditions: string;
  @ApiProperty({ example: "Terms and conditions go here..." })
  @IsString()
  contructor_signature: string;

  @ApiProperty({ type: [CreateEstimateCatalogItemDto], description: "Catalog line items" })
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => CreateEstimateCatalogItemDto)
  catalog_items: CreateEstimateCatalogItemDto[];
}
