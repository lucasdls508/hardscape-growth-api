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
var LeadSeedService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadSeedService = void 0;
const faker_1 = require("@faker-js/faker");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const lead_entity_1 = require("../entities/lead.entity");
const lead_status_enum_1 = require("../enums/lead_status.enum");
const typeorm_2 = require("typeorm");
const AGENCY_USER_ID = "08174b74-7d39-4234-a7f9-64ccf5b49728";
const SEED_COUNT = 20;
const AD_SOURCES = ["Facebook", "Instagram", "TikTok", "Google"];
const TIME_PREFERENCES = ["morning", "afternoon", "evening", "flexible"];
const FORM_VERSIONS = ["form_contact_v1", "form_contact_v2", "form_contact_v3"];
const projectscope = ["Landscape design", "Paver Consulting", " Wild Jungle Landscape design"];
const LEAD_STATUSES = Object.values(lead_status_enum_1.LeadStatus);
function generateFakeLead() {
    const source = faker_1.faker.helpers.arrayElement(AD_SOURCES);
    const status = faker_1.faker.helpers.arrayElement(LEAD_STATUSES);
    return {
        meta_lead_id: `meta_${faker_1.faker.string.alphanumeric(10)}`,
        agency_id: AGENCY_USER_ID,
        status,
        name: faker_1.faker.person.fullName(),
        email: faker_1.faker.internet.email().toLowerCase(),
        phone: faker_1.faker.phone.number(),
        address: faker_1.faker.location.streetAddress({ useFullAddress: true }),
        form_id: faker_1.faker.helpers.arrayElement(FORM_VERSIONS),
        form_info: {
            source,
            campaign: faker_1.faker.commerce.productName() + " Campaign",
            ad_id: `ad_${faker_1.faker.string.alphanumeric(8)}`,
            name: faker_1.faker.person.fullName(),
            email: faker_1.faker.internet.email().toLowerCase(),
            phone: faker_1.faker.phone.number(),
            projectscope: faker_1.faker.helpers.arrayElement([projectscope]),
        },
        start_time_pref: faker_1.faker.helpers.arrayElement(TIME_PREFERENCES),
        is_used: faker_1.faker.datatype.boolean(),
    };
}
let LeadSeedService = LeadSeedService_1 = class LeadSeedService {
    constructor(leadRepository) {
        this.leadRepository = leadRepository;
        this.logger = new common_1.Logger(LeadSeedService_1.name);
    }
    async seed(count = SEED_COUNT) {
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
        }
        catch (error) {
            this.logger.error("Failed to seed leads", error.stack);
            throw error;
        }
    }
    async clear() {
        this.logger.warn(`Clearing all leads for agency ${AGENCY_USER_ID}...`);
        await this.leadRepository
            .createQueryBuilder()
            .softDelete()
            .where("agency_id = :agencyId", { agencyId: AGENCY_USER_ID })
            .execute();
        this.logger.log("Leads cleared (soft deleted).");
    }
    async reseed(count = SEED_COUNT) {
        await this.clear();
        await this.seed(count);
    }
};
exports.LeadSeedService = LeadSeedService;
exports.LeadSeedService = LeadSeedService = LeadSeedService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(lead_entity_1.Lead)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], LeadSeedService);
//# sourceMappingURL=lead_seed.service.js.map