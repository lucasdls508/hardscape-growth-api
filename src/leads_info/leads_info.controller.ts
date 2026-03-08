import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Query, UseGuards } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { GetUser, GetUserInformation } from "src/auth/decorators/get-user.decorator";
import { JwtAuthenticationGuard } from "src/auth/guards/session-auth.guard";
import { LeadSeedService } from "src/leads_info/lead_seed/lead_seed.service";
import { Roles } from "src/user/decorators/roles.decorator";
import { User } from "src/user/entities/user.entity";
import { UserRoles } from "src/user/enums/role.enum";
import { CheckBuisnessGuard } from "src/user/guards/checkBuisness.guard";
import { RolesGuard } from "src/user/guards/roles.guard";
import { AssignConstructorDto } from "./dtos/assign_contructor.dto";
import { LeadStatsQueryDto } from "./dtos/lead_stats.dto";
import { GetLeadsQueryDto } from "./dtos/leads_query.dto";
import { UpdateLeadDto } from "./dtos/LeadStatus.dto";
import { Lead } from "./entities/lead.entity";
import { LeadsInfoService } from "./leads_info.service";
import { LeadsQueryService } from "./leads_query/leads_query.service";
import { LeadsStatsService } from "./leads_stats/leads_stats.service";

@ApiTags("Leads")
@Controller("leads")
@UseGuards(JwtAuthenticationGuard, RolesGuard, CheckBuisnessGuard)
@Roles(UserRoles.AGENCY_OWNER, UserRoles.CONTRUCTOR)
export class LeadsController {
  constructor(
    private readonly leadsQueryService: LeadsQueryService,
    private readonly leadsStatsService: LeadsStatsService,
    private readonly leadsService: LeadsInfoService,
    private readonly leadSeedService: LeadSeedService
  ) {}

  /* ----------------------------------------
   * GET USER LEADS (Paginated)
   * --------------------------------------*/
  @Get("")
  @ApiOperation({ summary: "Get user leads with pagination" })
  async getUserLeads(
    @GetUser() user: User,
    @Query() query: GetLeadsQueryDto,
    @GetUserInformation() userInfo: User
  ) {
    return this.leadsQueryService.getUserLeads({
      userId: user.id,
      role: userInfo.roles,
      page: Number(query.page || 1),
      limit: Number(query.limit || 10),
      status: query.status,
      is_used: query.is_used,
    });
  }
  @Get(":id")
  @ApiOperation({ summary: "Get user leads with pagination" })
  async GetLeadById(@GetUserInformation() userInfo: User, @Param("id") id: string) {
    return this.leadsService.getLeadById(id, userInfo);
  }
  @Patch(":id")
  @ApiOperation({ summary: "Update lead details" })
  async updateLead(
    @GetUserInformation() user: User,
    @Param("id") id: string,
    @Body() updateLeadDto: UpdateLeadDto
  ) {
    return this.leadsService.updateLead(id, user, updateLeadDto);
  }

  /* ----------------------------------------
   * GET LEAD STATISTICS (Cached)
   * --------------------------------------*/
  @Get("stats")
  @ApiOperation({ summary: "Get lead statistics (cached)" })
  async getLeadStats(
    @GetUser() user: User,
    @Query() query: LeadStatsQueryDto,
    @GetUserInformation() userInfo: User
  ) {
    return this.leadsStatsService.getLeadStatistics({
      userId: user.id,
      role: userInfo.roles[0],
      agency_id: userInfo.agency_profiles[0]?.id || null,
      filter: {
        type: query.type,
        monthName: query.monthName,
      },
    });
  }

  @Patch(":id/assign-constructor")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Assign a constructor to a lead",
    description: "Assigns a lead to a constructor and marks the lead as in progress",
  })
  @ApiParam({
    name: "id",
    description: "Lead ID",
    example: "550e8400-e29b-41d4-a716-446655440000",
  })
  @ApiBody({ type: AssignConstructorDto })
  @ApiResponse({
    status: 200,
    description: "Constructor assigned successfully",
    type: Lead,
  })
  @ApiResponse({
    status: 404,
    description: "Lead not found",
  })
  @ApiResponse({
    status: 400,
    description: "Lead already assigned",
  })
  async assignConstructor(@Param("id") leadId: string, @Body() dto: AssignConstructorDto): Promise<Lead> {
    return this.leadsService.assignConstructorToLead(leadId, dto.constructor_id);
  }

  /**
   * Reassign constructor
   */
  @Patch(":id/reassign-constructor")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Reassign constructor for a lead",
    description: "Replaces the currently assigned constructor with a new one",
  })
  @ApiParam({
    name: "id",
    description: "Lead ID",
  })
  @ApiBody({ type: AssignConstructorDto })
  @ApiResponse({
    status: 200,
    description: "Constructor reassigned successfully",
    type: Lead,
  })
  async reassignConstructor(@Param("id") leadId: string, @Body() dto: AssignConstructorDto): Promise<Lead> {
    return this.leadsService.reassignConstructor(leadId, dto.constructor_id);
  }

  /**
   * Unassign constructor
   */
  @Patch(":id/unassign-constructor")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Unassign constructor from a lead",
    description: "Removes constructor assignment and resets lead status",
  })
  @ApiParam({
    name: "id",
    description: "Lead ID",
  })
  @ApiResponse({
    status: 200,
    description: "Constructor unassigned successfully",
    type: Lead,
  })
  async unassignConstructor(@Param("id") leadId: string): Promise<Lead> {
    return this.leadsService.unassignConstructor(leadId);
  }
  @Patch(":id/project-details")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Update project details for a lead",
    description: "Updates the project details for a specific lead",
  })
  @ApiResponse({
    status: 200,
    description: "Project details updated successfully",
    type: Lead,
  })
  async updateProjectDetails(
    @Param("id") leadId: string,
    @Body("project_details") projectDetails: string,
    @GetUserInformation() userInfo: User
  ): Promise<Lead> {
    return this.leadsService.updateProjectDetails(leadId, projectDetails);
  }
}
