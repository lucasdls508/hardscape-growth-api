import { Queue } from "bullmq";
import { Repository } from "typeorm";
import { UpdateAppointmentDto } from "./dto/UpdateAppointments.dto";
import { Appointment } from "./enitities/appointments.entity";
export declare class AppointmentsService {
    _appointmentRepository: Repository<Appointment>;
    private readonly _leadQueue;
    constructor(_appointmentRepository: Repository<Appointment>, _leadQueue: Queue);
    private readonly _defaultJobOptions;
    findAllByAgency(agencyId: string, page?: number, limit?: number, startDate?: string, endDate?: string, searchTerm?: string): Promise<{
        data: Appointment[];
        meta: {
            total: number;
            page: number;
            lastPage: number;
        };
    }>;
    findOne(id: number): Promise<Appointment>;
    create(createDto: {
        agency_owner_id: string;
        lead_id: string;
        contructor_id?: string;
        lead_contact?: string;
        start_time: string;
        end_time?: string;
    }): Promise<Appointment>;
    update(id: number, updateDto: UpdateAppointmentDto): Promise<Appointment>;
    getAppointmentsByLeadId(leadId: string, page?: number, limit?: number): Promise<{
        data: Appointment[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    remove(id: number): Promise<boolean>;
    private _enqueueNotification;
    private _enqueueLeadStatusUpdate;
}
