import { Test, TestingModule } from '@nestjs/testing';
import { LeadsQueryService } from './leads_query.service';

describe('LeadsQueryService', () => {
  let service: LeadsQueryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LeadsQueryService],
    }).compile();

    service = module.get<LeadsQueryService>(LeadsQueryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
