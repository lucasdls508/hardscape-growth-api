import { Module } from "@nestjs/common";
import { LeadsInfoModule } from "src/leads_info/leads_info.module";
import { UserModule } from "src/user/user.module";
import { SeederService } from "./seeder.service";

@Module({
  imports: [UserModule, LeadsInfoModule],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}
