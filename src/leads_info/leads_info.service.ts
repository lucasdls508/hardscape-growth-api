import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AppointmentsService } from "src/appointments/appointments.service";
import { User } from "src/user/entities/user.entity";
import { Repository } from "typeorm";
import { UpdateLeadDto } from "./dtos/LeadStatus.dto";
import { Lead } from "./entities/lead.entity";
import { LeadStatus } from "./enums/lead_status.enum";
import { LeadSeedService } from "./lead_seed/lead_seed.service";

type CreateLeadParams = {
  page_id: string;
  meta_lead_id: string;
  form_id: string;
  user: User;
  contructor_id?: string;
} & Record<string, string>;

@Injectable()
export class LeadsInfoService {
  constructor(
    @InjectRepository(Lead) private readonly _leadRepository: Repository<Lead>,
    private readonly _appointmentsService: AppointmentsService,
    private readonly leadseedService: LeadSeedService
  ) {}

  async updateLeads(leadId: string) {
    return await this._leadRepository.update({ id: leadId }, { status: LeadStatus.CONTACTED });
  }
  async updateLead(leadId: string, user: User, updateLeadDto: UpdateLeadDto) {
    const lead = await this._leadRepository.findOne({
      where: { id: leadId },
    });

    if (!lead) {
      throw new NotFoundException("Lead not found");
    }

    // 🔐 Authorization check
    if (lead.agency_id !== user.id && lead.contructor_id !== user.id) {
      throw new ForbiddenException("You cannot update this lead");
    }

    // 🔥 Update dynamically
    Object.assign(lead, updateLeadDto);

    await this._leadRepository.save(lead);

    return {
      message: "Lead updated successfully",
      data: lead,
    };
  }
  async getLeadByPhone(phone_number: string): Promise<Lead> {
    return await this._leadRepository.findOne({
      where: { phone: phone_number },
    });
  }

  async getLeadByPsid(messenger_psid: string): Promise<Lead | null> {
    return await this._leadRepository.findOne({
      where: { messenger_psid },
    });
  }
  async getLeadById(id: string, user: User) {
    const leads = await this._leadRepository.findOne({
      where: { id },
      select: ["id", "name", "phone", "email", "status"],
    });
    if (!leads) {
      throw new NotFoundException("Lead not found");
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

  async updateProjectDetails(leadId: string, projectDetails: string) {
    const lead = await this._leadRepository.findOne({ where: { id: leadId } });
    if (!lead) {
      throw new NotFoundException("Lead not found");
    }
    lead.project_details = projectDetails;
    return await this._leadRepository.save(lead);
  }
  async createLead({
    page_id,
    meta_lead_id,
    form_id,
    user,
    contructor_id,
    ...otherFields
  }: {
    page_id: string;
    meta_lead_id: string;
    form_id: string;
    user: User;
    contructor_id?: string;
  } & Record<string, string>) {
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
    } catch (error) {
      console.log(error);
    }
  }

  async assignLeadToConstructor(leadId: string, contructorId: string) {
    const lead = await this._leadRepository.findOne({
      where: { id: leadId },
    });

    if (!lead) {
      throw new Error("Lead not found");
    }

    lead.contructor_id = contructorId;
    lead.is_used = true; // optional business rule
    lead.status = LeadStatus.IN_PROGRESS; // if you have this status

    return await this._leadRepository.save(lead);
  }

  async assignConstructorToLead(leadId: string, constructorId: string): Promise<Lead> {
    const lead = await this._leadRepository.findOne({
      where: { id: leadId },
    });

    if (!lead) {
      throw new NotFoundException("Lead not found");
    }

    if (lead.is_used) {
      throw new BadRequestException("Lead already assigned");
    }

    lead.contructor_id = constructorId;
    lead.is_used = true;
    lead.status = LeadStatus.IN_PROGRESS;

    return this._leadRepository.save(lead);
  }

  /**
   * Reassign constructor (optional but realistic)
   */
  async reassignConstructor(leadId: string, constructorId: string): Promise<Lead> {
    const lead = await this._leadRepository.findOne({
      where: { id: leadId },
    });

    if (!lead) {
      throw new NotFoundException("Lead not found");
    }

    lead.contructor_id = constructorId;
    lead.status = LeadStatus.IN_PROGRESS;

    return this._leadRepository.save(lead);
  }

  /**
   * Unassign constructor (edge case support)
   */
  async unassignConstructor(leadId: string): Promise<Lead> {
    const lead = await this._leadRepository.findOne({
      where: { id: leadId },
    });

    if (!lead) {
      throw new NotFoundException("Lead not found");
    }

    lead.contructor_id = null;
    lead.is_used = false;
    lead.status = LeadStatus.NEW;

    return this._leadRepository.save(lead);
  }
  async leedSeed() {
    return await this.leadseedService.seed();
  }
}
