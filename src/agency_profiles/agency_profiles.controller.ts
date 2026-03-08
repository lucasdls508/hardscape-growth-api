import { Body, Controller, Get, Patch, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from "@nestjs/swagger";
import { GetUser, GetUserInformation } from "src/auth/decorators/get-user.decorator";
import { JwtAuthenticationGuard } from "src/auth/guards/session-auth.guard";
import { Roles } from "src/user/decorators/roles.decorator";
import { User } from "src/user/entities/user.entity";
import { UserRoles } from "src/user/enums/role.enum";
import { RolesGuard } from "src/user/guards/roles.guard";
import { AgencyProfilesService } from "./agency_profiles.service";
import { UpdateAgencyProfileDto } from "./dtos/update_agency.dto";
import { AgencyProfile } from "./entities/agency_profiles.entity";

@ApiBearerAuth()
@UseGuards(JwtAuthenticationGuard, RolesGuard)
@Roles(UserRoles.AGENCY_OWNER)
@Controller("agency-profiles")
export class AgencyProfilesController {
  constructor(private readonly _agencyProfileService: AgencyProfilesService) {}
  @Patch("me")
  @UseGuards(JwtAuthenticationGuard)
  @ApiOperation({ summary: "Update my agency profile" })
  async updateMyAgencyProfile(@Req() req, @Body() dto: UpdateAgencyProfileDto, @GetUser() user: User) {
    return this._agencyProfileService.updateMyAgencyProfile(user, dto);
  }

  @Get("members")
  @ApiOperation({
    summary: "Get agency members",
    description: "Returns paginated users working under the authenticated agency owner",
  })
  // @ApiOkResponse({
  //   description: "Agency members fetched successfully",
  //   type: AgencyMembersResponseDto,
  // })
  async getAgencyMembers(@GetUser() user: User, @Query() query: { page: number; limit: number }) {
    const { page = 1, limit = 10 } = query;
    console.log(user, page, limit);
    return this._agencyProfileService.getAgencyMembers(user.id, page, limit);
  }

  @Patch("update-my-profile")
  @UseGuards(JwtAuthenticationGuard)
  @ApiOperation({
    summary: "Update my agency profile",
    description: "Allows agency owner to update agency profile information",
  })
  @ApiOkResponse({
    description: "Agency profile updated successfully",
    type: AgencyProfile,
  })
  async updateMyAgency(@GetUserInformation() user: User, @Body() dto: UpdateAgencyProfileDto) {
    return this._agencyProfileService.updateMyAgencyProfileInfo(user, dto);
  }
}
