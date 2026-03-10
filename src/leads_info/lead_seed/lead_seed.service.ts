import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Lead } from "src/leads_info/entities/lead.entity";
import { LeadStatus } from "src/leads_info/enums/lead_status.enum";
import { Repository } from "typeorm";

const AGENCY_USER_ID = "08174b74-7d39-4234-a7f9-64ccf5b49728";
const SEED_COUNT = 20;

const AD_SOURCES = ["Facebook", "Instagram", "TikTok", "Google"];
const TIME_PREFERENCES = ["morning", "afternoon", "evening", "flexible"];
const FORM_VERSIONS = ["form_contact_v1", "form_contact_v2", "form_contact_v3"];
const projectscope = ["Landscape design", "Paver Consulting", " Wild Jungle Landscape design"];
const LEAD_STATUSES = Object.values(LeadStatus);

const FIRST_NAMES = ["James", "Maria", "Carlos", "Sarah", "Michael", "Emily", "David", "Jennifer", "Robert", "Lisa"];
const LAST_NAMES = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Wilson", "Moore"];
const STREETS = ["Oak Ave", "Maple Dr", "Cedar Ln", "Pine St", "Elm Rd", "Birch Blvd", "Willow Way", "Spruce Ct"];
const CITIES = ["Austin", "Dallas", "Houston", "San Antonio", "Fort Worth"];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randStr(len: number): string {
  return Math.random().toString(36).substring(2, 2 + len).padEnd(len, "0");
}

function generateFakeLead(): Partial<Lead> {
  const source = pick(AD_SOURCES);
  const status = pick(LEAD_STATUSES);
  const firstName = pick(FIRST_NAMES);
  const lastName = pick(LAST_NAMES);
  const name = `${firstName} ${lastName}`;
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 999)}@example.com`;

  return {
    meta_lead_id: `meta_${randStr(10)}`,
    agency_id: AGENCY_USER_ID,
    status,
    name,
    email,
    phone: `+1512${Math.floor(Math.random() * 9000000) + 1000000}`,
    address: `${Math.floor(Math.random() * 9000) + 100} ${pick(STREETS)}, ${pick(CITIES)}, TX`,
    form_id: pick(FORM_VERSIONS),
    form_info: {
      source,
      campaign: `Hardscape ${pick(["Summer", "Spring", "Fall"])} Campaign`,
      ad_id: `ad_${randStr(8)}`,
      name,
      email,
      phone: `+1512${Math.floor(Math.random() * 9000000) + 1000000}`,
      projectscope: pick(projectscope),
    },
    start_time_pref: pick(TIME_PREFERENCES),
    is_used: Math.random() > 0.5,
  };
}

@Injectable()
export class LeadSeedService {
  private readonly logger = new Logger(LeadSeedService.name);

  constructor(
    @InjectRepository(Lead)
    private readonly leadRepository: Repository<Lead>
  ) {}

  async seed(count: number = SEED_COUNT): Promise<void> {
    this.logger.log(`Starting Lead seeding (${count} records)...`);

    const existingCount = await this.leadRepository.count({
      where: { agency_id: AGENCY_USER_ID },
    });

    if (existingCount > 0) {
      this.logger.warn(`Found ${existingCount} existing leads for agency ${AGENCY_USER_ID}. Skipping seed.`);
      return;
    }

    try {
      const fakeLeads = Array.from({ length: count }, generateFakeLead);
      const leads = this.leadRepository.create(fakeLeads);
      const saved = await this.leadRepository.save(leads);
      this.logger.log(`Successfully seeded ${saved.length} leads.`);
    } catch (error) {
      this.logger.error("Failed to seed leads", error.stack);
      throw error;
    }
  }

  async clear(): Promise<void> {
    this.logger.warn(`Clearing all leads for agency ${AGENCY_USER_ID}...`);
    await this.leadRepository
      .createQueryBuilder()
      .softDelete()
      .where("agency_id = :agencyId", { agencyId: AGENCY_USER_ID })
      .execute();
    this.logger.log("Leads cleared (soft deleted).");
  }

  async reseed(count: number = SEED_COUNT): Promise<void> {
    await this.clear();
    await this.seed(count);
  }
}
