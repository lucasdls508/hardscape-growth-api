import { InjectQueue } from "@nestjs/bull";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Queue } from "bullmq";
import { Repository } from "typeorm";
import { UpdateAppointmentDto } from "./dto/UpdateAppointments.dto";
import { Appointment } from "./enitities/appointments.entity";
import { APPOINTMENT_NOTIFICATION_JOB, LEAD_STATUS_UPDATE_JOB } from "./enums/appointments.enum";

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment) public _appointmentRepository: Repository<Appointment>,

    @InjectQueue("leads")
    private readonly _leadQueue: Queue
  ) {}

  // ─── Shared queue job options ────────────────────────────────────────────────
  private readonly _defaultJobOptions = {
    attempts: 3,
    backoff: { type: "exponential", delay: 3000 },
    removeOnComplete: true,
  };

  // ─── Queries ─────────────────────────────────────────────────────────────────

  async findAllByAgency(
    agencyId: string,
    page: number = 1,
    limit: number = 10,
    startDate?: string,
    endDate?: string,
    searchTerm?: string
  ) {
    const skip = (page - 1) * limit;

    const queryBuilder = this._appointmentRepository
      .createQueryBuilder("appointment")
      .leftJoin("appointment.lead", "lead")
      .where("appointment.agency_owner_id = :agencyId", { agencyId });

    // Date filtering
    if (startDate && endDate) {
      queryBuilder.andWhere("appointment.start_time BETWEEN :startDate AND :endDate", { startDate, endDate });
    } else if (startDate) {
      queryBuilder.andWhere("appointment.start_time >= :startDate", { startDate });
    } else if (endDate) {
      queryBuilder.andWhere("appointment.start_time <= :endDate", { endDate });
    }

    // Search filtering
    if (searchTerm) {
      console.log("SERAh time");
      queryBuilder.andWhere(
        `(lead.name ILIKE :search 
        OR lead.email ILIKE :search 
        OR lead.phone ILIKE :search)`,
        { search: `%${searchTerm}%` }
      );
    }

    queryBuilder
      .orderBy("appointment.start_time", "DESC")
      .take(limit)
      .skip(skip)
      .select([
        "appointment.id",
        "lead.id",
        "lead.name",
        "lead.email",
        "lead.phone",
        "appointment.start_time",
        "appointment.end_time",
        "appointment.status",
      ]);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number): Promise<Appointment> {
    const appointment = await this._appointmentRepository.findOne({
      where: { id },
      relations: ["lead", "constructor"],
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment #${id} not found`);
    }

    return appointment;
  }

  // ─── Commands ─────────────────────────────────────────────────────────────────

  async create(createDto: {
    agency_owner_id: string;
    lead_id: string;
    contructor_id?: string;
    lead_contact?: string;
    start_time: string;
    end_time?: string;
  }): Promise<Appointment> {
    const appointment = this._appointmentRepository.create(createDto);
    const saved = await this._appointmentRepository.save(appointment);

    // Fire both jobs in parallel — no awaiting each other
    await Promise.all([
      this._enqueueNotification(saved),
      this._enqueueLeadStatusUpdate(saved.lead_id), // 👈 loose coupling
    ]);
    console.log(appointment);

    await this._leadQueue.add("appointment_sending", {
      leadId: appointment.lead_id,
      msg: `Your appointment is set on ${appointment.start_time}`,
      user: appointment.agency_owner_id,
    });
    return saved;
  }

  async update(id: number, updateDto: UpdateAppointmentDto): Promise<Appointment> {
    const appointment = await this._appointmentRepository.preload({
      id,
      ...updateDto,
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment #${id} not found`);
    }

    return this._appointmentRepository.save(appointment);
  }
  async getAppointmentsByLeadId(
    leadId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    data: Appointment[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    const qb = this._appointmentRepository
      .createQueryBuilder("appointment")
      .leftJoinAndSelect("appointment.lead", "lead")
      .where("appointment.lead_id = :leadId", { leadId })
      .select([
        "appointment.id",
        "lead.id",
        "lead.name",
        "lead.email",
        "lead.phone",
        "appointment.start_time",
        "appointment.end_time",
        "appointment.status",
      ])
      .orderBy("appointment.start_time", "DESC")
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async remove(id: number): Promise<boolean> {
    const result = await this._appointmentRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  // ─── Private Queue Helpers ────────────────────────────────────────────────────

  private _enqueueNotification(appointment: Appointment) {
    return this._leadQueue.add(
      APPOINTMENT_NOTIFICATION_JOB,
      {
        appointmentId: appointment.id,
        agency_owner_id: appointment.agency_owner_id,
        constructor_id: appointment.constructor_id,
        lead_id: appointment.lead_id,
        lead_contact: appointment.lead_contact,
        start_time: appointment.start_time,
        end_time: appointment.end_time,
      },
      this._defaultJobOptions
    );
  }

  /**
   * Tells LeadsInfoService (via queue) to mark the lead as CONTACTED.
   * AppointmentsService has zero knowledge of LeadsInfoService. ✅
   */
  private _enqueueLeadStatusUpdate(leadId: string) {
    return this._leadQueue.add(LEAD_STATUS_UPDATE_JOB, { leadId }, this._defaultJobOptions);
  }
}
