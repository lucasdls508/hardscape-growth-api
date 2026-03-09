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
exports.LeadsInfoService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const appointments_service_1 = require("../appointments/appointments.service");
const typeorm_2 = require("typeorm");
const lead_entity_1 = require("./entities/lead.entity");
const lead_status_enum_1 = require("./enums/lead_status.enum");
const lead_seed_service_1 = require("./lead_seed/lead_seed.service");
let LeadsInfoService = class LeadsInfoService {
    constructor(_leadRepository, _appointmentsService, leadseedService) {
        this._leadRepository = _leadRepository;
        this._appointmentsService = _appointmentsService;
        this.leadseedService = leadseedService;
    }
    async updateLeads(leadId) {
        return await this._leadRepository.update({ id: leadId }, { status: lead_status_enum_1.LeadStatus.CONTACTED });
    }
    async updateLead(leadId, user, updateLeadDto) {
        const lead = await this._leadRepository.findOne({
            where: { id: leadId },
        });
        if (!lead) {
            throw new common_1.NotFoundException("Lead not found");
        }
        if (lead.agency_id !== user.id && lead.contructor_id !== user.id) {
            throw new common_1.ForbiddenException("You cannot update this lead");
        }
        Object.assign(lead, updateLeadDto);
        await this._leadRepository.save(lead);
        return {
            message: "Lead updated successfully",
            data: lead,
        };
    }
    async getLeadByPhone(phone_number) {
        return await this._leadRepository.findOne({
            where: { phone: phone_number },
        });
    }
    async getLeadByPsid(messenger_psid) {
        return await this._leadRepository.findOne({
            where: { messenger_psid },
        });
    }
    async getLeadById(id, user) {
        const leads = await this._leadRepository.findOne({
            where: { id },
            select: ["id", "name", "phone", "email", "status"],
        });
        if (!leads) {
            throw new common_1.NotFoundException("Lead not found");
        }
        return {
            prepared_for: leads,
            prepared_by: {
                id: user.id,
                buisness_profiles: user.buisness_profiles,
                email: user.email,
                agency: user.agency_profiles,
            },
        };
    }
    async updateProjectDetails(leadId, projectDetails) {
        const lead = await this._leadRepository.findOne({ where: { id: leadId } });
        if (!lead) {
            throw new common_1.NotFoundException("Lead not found");
        }
        lead.project_details = projectDetails;
        return await this._leadRepository.save(lead);
    }
    async createLead({ page_id, meta_lead_id, form_id, user, contructor_id, ...otherFields }) {
        try {
            const lead = this._leadRepository.create({
                meta_lead_id,
                agency: user,
                agency_id: user.id,
                contructor_id: contructor_id || null,
                form_id,
                ...otherFields,
            });
            await this._leadRepository.save(lead);
            return lead;
        }
        catch (error) {
            console.log(error);
        }
    }
    async assignLeadToConstructor(leadId, contructorId) {
        const lead = await this._leadRepository.findOne({
            where: { id: leadId },
        });
        if (!lead) {
            throw new Error("Lead not found");
        }
        lead.contructor_id = contructorId;
        lead.is_used = true;
        lead.status = lead_status_enum_1.LeadStatus.IN_PROGRESS;
        return await this._leadRepository.save(lead);
    }
    async assignConstructorToLead(leadId, constructorId) {
        const lead = await this._leadRepository.findOne({
            where: { id: leadId },
        });
        if (!lead) {
            throw new common_1.NotFoundException("Lead not found");
        }
        if (lead.is_used) {
            throw new common_1.BadRequestException("Lead already assigned");
        }
        lead.contructor_id = constructorId;
        lead.is_used = true;
        lead.status = lead_status_enum_1.LeadStatus.IN_PROGRESS;
        return this._leadRepository.save(lead);
    }
    async reassignConstructor(leadId, constructorId) {
        const lead = await this._leadRepository.findOne({
            where: { id: leadId },
        });
        if (!lead) {
            throw new common_1.NotFoundException("Lead not found");
        }
        lead.contructor_id = constructorId;
        lead.status = lead_status_enum_1.LeadStatus.IN_PROGRESS;
        return this._leadRepository.save(lead);
    }
    async unassignConstructor(leadId) {
        const lead = await this._leadRepository.findOne({
            where: { id: leadId },
        });
        if (!lead) {
            throw new common_1.NotFoundException("Lead not found");
        }
        lead.contructor_id = null;
        lead.is_used = false;
        lead.status = lead_status_enum_1.LeadStatus.NEW;
        return this._leadRepository.save(lead);
    }
    async leedSeed() {
        return await this.leadseedService.seed();
    }
};
exports.LeadsInfoService = LeadsInfoService;
exports.LeadsInfoService = LeadsInfoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(lead_entity_1.Lead)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        appointments_service_1.AppointmentsService,
        lead_seed_service_1.LeadSeedService])
], LeadsInfoService);
//# sourceMappingURL=leads_info.service.js.map