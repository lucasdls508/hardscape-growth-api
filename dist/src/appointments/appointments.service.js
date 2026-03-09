"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentsService = void 0;
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const bullmq_1 = require("bullmq");
const typeorm_2 = require("typeorm");
const appointments_entity_1 = require("./enitities/appointments.entity");
const appointments_enum_1 = require("./enums/appointments.enum");
let AppointmentsService = class AppointmentsService {
    constructor(_appointmentRepository, _leadQueue) {
        this._appointmentRepository = _appointmentRepository;
        this._leadQueue = _leadQueue;
        this._defaultJobOptions = {
            attempts: 3,
            backoff: { type: "exponential", delay: 3000 },
            removeOnComplete: true,
        };
    }
    async findAllByAgency(agencyId, page = 1, limit = 10, startDate, endDate, searchTerm) {
        const skip = (page - 1) * limit;
        const queryBuilder = this._appointmentRepository
            .createQueryBuilder("appointment")
            .leftJoin("appointment.lead", "lead")
            .where("appointment.agency_owner_id = :agencyId", { agencyId });
        if (startDate && endDate) {
            queryBuilder.andWhere("appointment.start_time BETWEEN :startDate AND :endDate", { startDate, endDate });
        }
        else if (startDate) {
            queryBuilder.andWhere("appointment.start_time >= :startDate", { startDate });
        }
        else if (endDate) {
            queryBuilder.andWhere("appointment.start_time <= :endDate", { endDate });
        }
        if (searchTerm) {
            console.log("SERAh time");
            queryBuilder.andWhere(`(lead.name ILIKE :search 
        OR lead.email ILIKE :search 
        OR lead.phone ILIKE :search)`, { search: `%${searchTerm}%` });
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
    async findOne(id) {
        const appointment = await this._appointmentRepository.findOne({
            where: { id },
            relations: ["lead", "constructor"],
        });
        if (!appointment) {
            throw new common_1.NotFoundException(`Appointment #${id} not found`);
        }
        return appointment;
    }
    async create(createDto) {
        const appointment = this._appointmentRepository.create(createDto);
        const saved = await this._appointmentRepository.save(appointment);
        await Promise.all([
            this._enqueueNotification(saved),
            this._enqueueLeadStatusUpdate(saved.lead_id),
        ]);
        console.log(appointment);
        await this._leadQueue.add("appointment_sending", {
            leadId: appointment.lead_id,
            msg: `Your appointment is set on ${appointment.start_time}`,
            user: appointment.agency_owner_id,
        });
        return saved;
    }
    async update(id, updateDto) {
        const appointment = await this._appointmentRepository.preload({
            id,
            ...updateDto,
        });
        if (!appointment) {
            throw new common_1.NotFoundException(`Appointment #${id} not found`);
        }
        return this._appointmentRepository.save(appointment);
    }
    async getAppointmentsByLeadId(leadId, page = 1, limit = 10) {
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
    async remove(id) {
        const result = await this._appointmentRepository.delete(id);
        return (result.affected ?? 0) > 0;
    }
    _enqueueNotification(appointment) {
        return this._leadQueue.add(appointments_enum_1.APPOINTMENT_NOTIFICATION_JOB, {
            appointmentId: appointment.id,
            agency_owner_id: appointment.agency_owner_id,
            constructor_id: appointment.constructor_id,
            lead_id: appointment.lead_id,
            lead_contact: appointment.lead_contact,
            start_time: appointment.start_time,
            end_time: appointment.end_time,
        }, this._defaultJobOptions);
    }
    _enqueueLeadStatusUpdate(leadId) {
        return this._leadQueue.add(appointments_enum_1.LEAD_STATUS_UPDATE_JOB, { leadId }, this._defaultJobOptions);
    }
};
exports.AppointmentsService = AppointmentsService;
exports.AppointmentsService = AppointmentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(appointments_entity_1.Appointment)),
    __param(1, (0, bull_1.InjectQueue)("leads")),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        bullmq_1.Queue])
], AppointmentsService);
//# sourceMappingURL=appointments.service.js.map