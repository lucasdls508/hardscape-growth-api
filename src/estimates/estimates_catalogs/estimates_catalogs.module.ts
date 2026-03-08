import { Module } from '@nestjs/common';
import { EstimatesCatalogsController } from './estimates_catalogs.controller';
import { EstimatesCatalogsService } from './estimates_catalogs.service';

@Module({
  controllers: [EstimatesCatalogsController],
  providers: [EstimatesCatalogsService]
})
export class EstimatesCatalogsModule {}
