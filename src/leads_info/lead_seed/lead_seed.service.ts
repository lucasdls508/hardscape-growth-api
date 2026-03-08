import { faker } from "@faker-js/faker";
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

function generateFakeLead(): Partial<Lead> {
  const source = faker.helpers.arrayElement(AD_SOURCES);
  const status = faker.helpers.arrayElement(LEAD_STATUSES);

  return {
    meta_lead_id: `meta_${faker.string.alphanumeric(10)}`,
    agency_id: AGENCY_USER_ID,
    status,
    name: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    phone: faker.phone.number(),
    address: faker.location.streetAddress({ useFullAddress: true }),
    form_id: faker.helpers.arrayElement(FORM_VERSIONS),
    form_info: {
      source,
      campaign: faker.commerce.productName() + " Campaign",
      ad_id: `ad_${faker.string.alphanumeric(8)}`,
      name: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      phone: faker.phone.number(),
      projectscope: faker.helpers.arrayElement([projectscope]),
    },
    start_time_pref: faker.helpers.arrayElement(TIME_PREFERENCES),
    is_used: faker.datatype.boolean(),
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
