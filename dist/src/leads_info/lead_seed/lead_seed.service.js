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
const FIRST_NAMES = ["James", "Maria", "Carlos", "Sarah", "Michael", "Emily", "David", "Jennifer", "Robert", "Lisa"];
const LAST_NAMES = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Wilson", "Moore"];
const STREETS = ["Oak Ave", "Maple Dr", "Cedar Ln", "Pine St", "Elm Rd", "Birch Blvd", "Willow Way", "Spruce Ct"];
const CITIES = ["Austin", "Dallas", "Houston", "San Antonio", "Fort Worth"];
function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
function randStr(len) {
    return Math.random().toString(36).substring(2, 2 + len).padEnd(len, "0");
}
function generateFakeLead() {
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