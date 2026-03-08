import { PartialType } from "@nestjs/swagger";
import { CreateCatalogDto } from "./CreateCatalogs.dto";

export class UpdateCatalogDto extends PartialType(CreateCatalogDto) {}
