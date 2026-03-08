import { Test, TestingModule } from '@nestjs/testing';
import { LeadSeedService } from './lead_seed.service';

describe('LeadSeedService', () => {
  let service: LeadSeedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LeadSeedService],
    }).compile();

    service = module.get<LeadSeedService>(LeadSeedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
