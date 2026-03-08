import { Test, TestingModule } from '@nestjs/testing';
import { EstimatesCatalogsService } from './estimates_catalogs.service';

describe('EstimatesCatalogsService', () => {
  let service: EstimatesCatalogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EstimatesCatalogsService],
    }).compile();

    service = module.get<EstimatesCatalogsService>(EstimatesCatalogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
