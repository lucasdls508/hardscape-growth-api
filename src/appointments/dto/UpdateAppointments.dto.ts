import { PartialType } from "@nestjs/mapped-types";
import { CreateAppointmentDto } from "./CreateAppointments.dto";

export class UpdateAppointmentDto extends PartialType(CreateAppointmentDto) {}
