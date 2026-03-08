import { Test, TestingModule } from '@nestjs/testing';
import { EstimatesCatalogsController } from './estimates_catalogs.controller';

describe('EstimatesCatalogsController', () => {
  let controller: EstimatesCatalogsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EstimatesCatalogsController],
    }).compile();

    controller = module.get<EstimatesCatalogsController>(EstimatesCatalogsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
