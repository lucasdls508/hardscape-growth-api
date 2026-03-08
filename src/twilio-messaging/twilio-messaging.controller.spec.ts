import { Test, TestingModule } from '@nestjs/testing';
import { TwilioMessagingController } from './twilio-messaging.controller';

describe('TwilioMessagingController', () => {
  let controller: TwilioMessagingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TwilioMessagingController],
    }).compile();

    controller = module.get<TwilioMessagingController>(TwilioMessagingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
