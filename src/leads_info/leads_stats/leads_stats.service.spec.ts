import { Test, TestingModule } from '@nestjs/testing';
import { LeadsStatsService } from './leads_stats.service';

describe('LeadsStatsService', () => {
  let service: LeadsStatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LeadsStatsService],
    }).compile();

    service = module.get<LeadsStatsService>(LeadsStatsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
