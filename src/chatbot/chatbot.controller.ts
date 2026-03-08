import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { GetUserInformation } from "src/auth/decorators/get-user.decorator";
import { JwtAuthenticationGuard } from "src/auth/guards/session-auth.guard";
import { MetaBuisnessProfiles } from "src/page_session/entites/meta_buisness.entity";
import { Roles } from "src/user/decorators/roles.decorator";
import { UserRoles } from "src/user/enums/role.enum";
import { RolesGuard } from "src/user/guards/roles.guard";
import { ChatbotService } from "./chatbot.service";
import { ChatRequestDto } from "./dto/ChatRequest.dto";

@Controller("chatbot")
export class ChatbotController {
  constructor(private readonly _chatbotService: ChatbotService) {}
  @Post("message")
  @UsePipes(new ValidationPipe({ transform: true }))
  async handleChat(@Body() chatRequest: ChatRequestDto) {
    try {
      const { clientId, userMessage, formData, userInfo } = chatRequest;

      const response = await this._chatbotService.chatWithForm(clientId, userMessage, formData, userInfo);

      return response;
    } catch (error) {
      // Mapping the service error to a NestJS HTTP Exception
      throw new InternalServerErrorException({
        message: "Could not process chat message",
        detail: error.message,
      });
    }
  }
  @Post("message/raw")
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(UserRoles.CONTRUCTOR, UserRoles.AGENCY_OWNER)
  async handleRawMessaging(@Body() chatRequest: any, @GetUserInformation() userInfo: MetaBuisnessProfiles) {
    try {
      const { clientId, userMessage } = chatRequest;
      const response = await this._chatbotService.chatRaw(clientId, userMessage, userInfo);

      return response;
    } catch (error) {
      // Mapping the service error to a NestJS HTTP Exception
      throw new InternalServerErrorException({
        message: "Could not process chat message",
        detail: error.message,
      });
    }
  }
}
