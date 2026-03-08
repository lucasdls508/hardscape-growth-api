import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { GetUser } from "src/auth/decorators/get-user.decorator";
import { JwtAuthenticationGuard } from "src/auth/guards/session-auth.guard";
import { Roles } from "src/user/decorators/roles.decorator";
import { User } from "src/user/entities/user.entity";
import { UserRoles } from "src/user/enums/role.enum";
import { RolesGuard } from "src/user/guards/roles.guard";
import { CreateEstimateDto } from "./dtos/CreateEstimate.dto";
import { UpdateEstimateStatusDto } from "./dtos/EstimateStatusUpdate.dto";
import { SignEstimateDto } from "./dtos/signEstimate.dto";
import { UpdateLeadSignatureDto } from "./dtos/UpdateLeadSignature.dto";
import { Estimates, EstimateStatus } from "./entities/estimates.entity";
import { EstimatesService } from "./estimates.service";

@ApiTags("Estimates")
@Controller("estimates")
export class EstimatesController {
  constructor(private readonly estimatesService: EstimatesService) {}

  /* ---------------- CREATE ESTIMATE ---------------- */
  @Post()
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(UserRoles.CONTRUCTOR, UserRoles.AGENCY_OWNER)
  @ApiOperation({ summary: "Create a new estimate with catalog items" })
  @ApiResponse({ status: 201, description: "Estimate created", type: Estimates })
  async create(@GetUser() user: User, @Body() body: CreateEstimateDto): Promise<Estimates> {
    return this.estimatesService.create({ ...body, prepared_by: user.id });
  }

  /* ---------------- GET ESTIMATES BY USER ---------------- */
  @Get("")
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(UserRoles.CONTRUCTOR, UserRoles.AGENCY_OWNER)
  @ApiOperation({ summary: "Get all estimates by user (paginated)" })
  @ApiQuery({ name: "page", required: false, type: Number, example: 1 })
  @ApiQuery({ name: "limit", required: false, type: Number, example: 10 })
  async findByUser(
    @GetUser() user: User,
    @Query("page") page = "1",
    @Query("limit") limit = "10",
    @Query("status") status: EstimateStatus,
    @Query("search") searchTerm: string
  ) {
    return this.estimatesService.findByUser(user.id, Number(page), Number(limit), status, searchTerm);
  }

  @Patch(":id/status")
  @ApiOperation({ summary: "Update status of an estimate" })
  @ApiOkResponse({ type: Estimates, description: "Estimate status updated successfully" })
  @ApiBadRequestResponse({ description: "Invalid status value" })
  @ApiNotFoundResponse({ description: "Estimate not found" })
  async updateEstimateStatus(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateEstimateStatusDto) {
    return this.estimatesService.updateEstimateStatus(id, dto);
  }

  @Get("lead/:leadId")
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(UserRoles.CONTRUCTOR, UserRoles.AGENCY_OWNER)
  @ApiOperation({ summary: "Get all estimates for a lead" })
  async getEstimatesByLead(@Param("leadId") leadId: string) {
    return this.estimatesService.getEstimatesByLead(leadId);
  }

  @Get("statistics")
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(UserRoles.CONTRUCTOR, UserRoles.AGENCY_OWNER)
  @ApiOperation({ summary: "Get estimate statistics grouped by lead status" })
  async getEstimateStatistics(@GetUser() user: User) {
    return this.estimatesService.getCombinedEstimateStatistics(user.id);
  }

  /* ---------------- GET SINGLE ESTIMATE ---------------- */
  @Get(":id")
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(UserRoles.CONTRUCTOR, UserRoles.AGENCY_OWNER)
  @ApiOperation({ summary: "Get a single estimate by ID" })
  @ApiResponse({ status: 200, description: "Estimate found", type: Estimates })
  async findOne(@Param("id", ParseIntPipe) id: number): Promise<Estimates> {
    return this.estimatesService.findOne(id);
  }
  @Get(":id/sign")
  async renderSignPage(@Param("id", ParseIntPipe) id: number, @Res() reply) {
    const html = await this.estimatesService.renderSignPage(id);
    return reply.status(200).header("Content-Type", "text/html; charset=utf-8").send(html);
  }

  @Post(":id/sign")
  @HttpCode(HttpStatus.OK)
  sign(@Param("id", ParseIntPipe) id: number, @Body() dto: SignEstimateDto) {
    return this.estimatesService.sign(id, dto.lead_signature);
  }

  /* ---------------- UPDATE LEAD SIGNATURE ---------------- */
  @Patch(":id/lead-signature")
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(UserRoles.CONTRUCTOR, UserRoles.AGENCY_OWNER)
  @ApiOperation({ summary: "Update lead signature for an estimate" })
  @ApiResponse({ status: 200, description: "Lead signature updated", type: Estimates })
  async updateLeadSignature(@Param("id", ParseIntPipe) id: number, @Body() body: UpdateLeadSignatureDto) {
    return this.estimatesService.updateLeadSignature(id, body.lead_signature);
  }
}
