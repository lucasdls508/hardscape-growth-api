import { Global, Module } from "@nestjs/common";
import { TwilioMessagingController } from "./twilio-messaging.controller";
import { TwilioMessagingService } from "./twilio-messaging.service";

@Global()
@Module({
  providers: [TwilioMessagingService],
  controllers: [TwilioMessagingController],
  exports: [TwilioMessagingService],
})
export class TwilioMessagingModule {}
