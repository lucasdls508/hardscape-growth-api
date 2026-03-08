import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { GetUserInformation } from "src/auth/decorators/get-user.decorator";
import { JwtAuthenticationGuard } from "src/auth/guards/session-auth.guard";
import { Roles } from "src/user/decorators/roles.decorator";
import { User } from "src/user/entities/user.entity";
import { UserRoles } from "src/user/enums/role.enum";
import { RolesGuard } from "src/user/guards/roles.guard";
import { AppointmentsService } from "./appointments.service";
import { CreateAppointmentDto } from "./dto/CreateAppointments.dto";
import { UpdateAppointmentDto } from "./dto/UpdateAppointments.dto";

@Controller("appointments")
export class AppointmentsController {
  constructor(private readonly _appointmentsService: AppointmentsService) {}

  /**
   * GET /appointments?agencyId=xxx&page=1&limit=10
   */
  @Get()
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(UserRoles.AGENCY_OWNER, UserRoles.CONTRUCTOR)
  findAll(
    @GetUserInformation() userInfo: User,
    @Query("page") page = 1,
    @Query("limit") limit = 10,
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string,
    @Query("searchTerm") searchTerm?: string
  ) {
    const agencyId = userInfo.agency_profiles[0].id;
    return this._appointmentsService.findAllByAgency(agencyId, +page, +limit, startDate, endDate, searchTerm);
  }

  @Get("lead/:leadId")
  async getByLeadId(
    @Param("leadId") leadId: string,
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number
  ) {
    return this._appointmentsService.getAppointmentsByLeadId(leadId, page, limit);
  }
  /**
   * GET /appointments/:id
   */
  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this._appointmentsService.findOne(id);
  }

  /**
   * POST /appointments
   */
  @Post()
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(UserRoles.AGENCY_OWNER, UserRoles.CONTRUCTOR)
  create(@Body() createDto: CreateAppointmentDto, @GetUserInformation() userInfo: User) {
    return this._appointmentsService.create({
      ...createDto,
      agency_owner_id: userInfo.agency_profiles[0].id,
    });
  }

  /**
   * PATCH /appointments/:id
   */
  @Patch(":id")
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(UserRoles.AGENCY_OWNER, UserRoles.CONTRUCTOR)
  update(@Param("id", ParseIntPipe) id: number, @Body() updateDto: UpdateAppointmentDto) {
    return this._appointmentsService.update(id, updateDto);
  }

  /**
   * DELETE /appointments/:id
   */
  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param("id", ParseIntPipe) id: number) {
    return this._appointmentsService.remove(id);
  }
}
