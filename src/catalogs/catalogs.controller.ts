import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CatalogsService } from "./catalogs.service";
import { CreateCatalogDto } from "./dtos/CreateCatalogs.dto";
import { UpdateCatalogDto } from "./dtos/UpdateCatalogs.dto";
import { Catalogs } from "./enitities/catalogs.entity";
import { CatalogResponseInterceptor } from "./interceptors/response.interceptor";

@ApiTags("Catalogs")
@Controller("catalogs")
@UseInterceptors(CatalogResponseInterceptor)
export class CatalogsController {
  constructor(private readonly _catalogsService: CatalogsService) {}

  /* ---------------- CREATE ---------------- */
  @Post()
  @ApiOperation({ summary: "Create a new catalog item" })
  @ApiResponse({ status: 201, description: "Catalog created successfully", type: Catalogs })
  async create(@Body() body: CreateCatalogDto): Promise<Catalogs> {
    return this._catalogsService.create(body);
  }

  /* ---------------- FIND ALL ---------------- */
  @Get()
  @ApiOperation({ summary: "Get all catalogs with pagination" })
  @ApiQuery({ name: "page", required: false, type: Number, example: 1 })
  @ApiQuery({ name: "limit", required: false, type: Number, example: 10 })
  @ApiResponse({ status: 200, description: "Paginated list of catalogs" })
  async findAll(
    @Query("page") page = "1",
    @Query("limit") limit = "10",
    @Query("search") search: string
  ): Promise<{ data: Catalogs[]; total: number; page: number; limit: number }> {
    return this._catalogsService.findAll(Number(page), Number(limit), search);
  }

  /* ---------------- FIND ONE ---------------- */
  @Get(":id")
  @ApiOperation({ summary: "Get a single catalog by ID" })
  @ApiResponse({ status: 200, description: "Catalog found", type: Catalogs })
  @ApiResponse({ status: 404, description: "Catalog not found" })
  async findOne(@Param("id", ParseIntPipe) id: number): Promise<Catalogs> {
    return this._catalogsService.findOne(id);
  }

  /* ---------------- UPDATE ---------------- */
  @Patch(":id")
  @ApiOperation({ summary: "Update a catalog item" })
  @ApiResponse({ status: 200, description: "Catalog updated successfully", type: Catalogs })
  @ApiResponse({ status: 404, description: "Catalog not found" })
  async update(@Param("id", ParseIntPipe) id: number, @Body() body: UpdateCatalogDto): Promise<Catalogs> {
    return this._catalogsService.update(id, body);
  }

  /* ---------------- DELETE ---------------- */
  @Delete(":id")
  @ApiOperation({ summary: "Soft delete a catalog item" })
  @ApiResponse({ status: 200, description: "Catalog deleted successfully" })
  async remove(@Param("id", ParseIntPipe) id: number) {
    await this._catalogsService.remove(id);
    return { message: "Catalog deleted successfully" };
  }
}
