import { User } from "src/user/entities/user.entity";
import { AppointmentsService } from "./appointments.service";
import { CreateAppointmentDto } from "./dto/CreateAppointments.dto";
import { UpdateAppointmentDto } from "./dto/UpdateAppointments.dto";
export declare class AppointmentsController {
    private readonly _appointmentsService;
    constructor(_appointmentsService: AppointmentsService);
    findAll(userInfo: User, page?: number, limit?: number, startDate?: string, endDate?: string, searchTerm?: string): Promise<{
        data: import("./enitities/appointments.entity").Appointment[];
        meta: {
            total: number;
            page: number;
            lastPage: number;
        };
    }>;
    getByLeadId(leadId: string, page: number, limit: number): Promise<{
        data: import("./enitities/appointments.entity").Appointment[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: number): Promise<import("./enitities/appointments.entity").Appointment>;
    create(createDto: CreateAppointmentDto, userInfo: User): Promise<import("./enitities/appointments.entity").Appointment>;
    update(id: number, updateDto: UpdateAppointmentDto): Promise<import("./enitities/appointments.entity").Appointment>;
    remove(id: number): Promise<boolean>;
}
