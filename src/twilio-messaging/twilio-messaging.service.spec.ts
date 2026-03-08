import { Test, TestingModule } from '@nestjs/testing';
import { TwilioMessagingService } from './twilio-messaging.service';

describe('TwilioMessagingService', () => {
  let service: TwilioMessagingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TwilioMessagingService],
    }).compile();

    service = module.get<TwilioMessagingService>(TwilioMessagingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
