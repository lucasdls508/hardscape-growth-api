import { BullModule } from "@nestjs/bull";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppointmentsModule } from "src/appointments/appointments.module";
import { AuthModule } from "src/auth/auth.module";
import { LeadSeedService } from "src/leads_info/lead_seed/lead_seed.service";
import { UserModule } from "src/user/user.module";
import { Lead } from "./entities/lead.entity";
import { LeadsController } from "./leads_info.controller";
import { LeadsInfoService } from "./leads_info.service";
import { LeadsQueryService } from "./leads_query/leads_query.service";
import { LeadsStatsService } from "./leads_stats/leads_stats.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Lead]),
    AuthModule,
    UserModule,
    BullModule.registerQueue({ name: "leads" }),
    AppointmentsModule,
  ],
  controllers: [LeadsController],
  providers: [LeadsInfoService, LeadsStatsService, LeadsQueryService, LeadSeedService],
  exports: [LeadsInfoService],
})
export class LeadsInfoModule {}
