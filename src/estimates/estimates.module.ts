import { BullModule } from "@nestjs/bull";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LEAD_QUEUE_JOB } from "src/bull/processors/leadsQueue";
import { Catalogs } from "src/catalogs/enitities/catalogs.entity";
import { S3Module } from "src/s3/s3.module";
import { Estimates } from "./entities/estimates.entity";
import { EstimateRendererService } from "./estimate-renderer.service";
import { EstimatesController } from "./estimates.controller";
import { EstimatesService } from "./estimates.service";
import { EstimateCatalogs } from "./estimates_catalogs/entities/estimate_catalogs.entity";
import { EstimatesCatalogsModule } from "./estimates_catalogs/estimates_catalogs.module";

@Module({
  controllers: [EstimatesController],
  providers: [EstimatesService, EstimateRendererService],
  exports: [EstimatesService],
  imports: [
    TypeOrmModule.forFeature([Estimates, EstimateCatalogs, Catalogs]),
    EstimatesCatalogsModule,
    BullModule.registerQueue({
      name: LEAD_QUEUE_JOB,
    }),
    S3Module,
  ],
})
export class EstimatesModule {}
