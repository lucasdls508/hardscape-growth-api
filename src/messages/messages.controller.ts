import { Body, Controller, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { GetConversation, GetUser } from "src/auth/decorators/get-user.decorator";
import { JwtAuthenticationGuard } from "src/auth/guards/session-auth.guard";
import { User } from "src/user/entities/user.entity";
import { MessageEligabilityGuard } from "./decorators/message-eligability.guard";
import { SendMessageDto, SendMessageTypes } from "./dto/send-message.dto";
import { MessagesService } from "./messages.service";
// import { MessageEligabilityGuard } from "./decorators/message-eligability.guard";

@Controller("messages")
export class MessagesController {
  constructor(
    private readonly _messagesService: MessagesService
    // private readonly socketService:SocketService
  ) {}
  @Get(":id")
  @UseGuards(JwtAuthenticationGuard)
  async getMessages(
    @Param("id") conversationId: number,
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10
  ) {
    const response = await this._messagesService.getMessages({
      conversationId,
      page,
      limit,
    });
    return response;
  }
  @Post("conversation/:id")
  @UseGuards(MessageEligabilityGuard)
  async sendMessage(
    @GetConversation() conversation: any,
    @Param("id") conversationId: number,
    @Body() body: SendMessageTypes
  ) {
    // conversation[0].user.buisnessProfiles.user = conversation[0].user;
    const response = await this._messagesService.sendMessageWithAI(body, conversation[0].user, conversation); // Pass user info for context
    // return response;
    return response;
  }

  @Post(":id")
  @UseGuards(JwtAuthenticationGuard, MessageEligabilityGuard)
  async sendMessages(
    @GetConversation() conversation: any,
    @Param("id") conversationId: number,
    @Body() body: SendMessageDto,
    @GetUser() user: User
  ) {
    const response = await this._messagesService.sendMessage({ ...body, sender: user }); // Pass user info for context
    return response;
  }
  // @Post("file")
  // @UseGuards(JwtAuthenticationGuard, MessageEligabilityGuard)
  // @UseInterceptors(
  //   FileFieldsInterceptor(
  //     [
  //       { name: "images", maxCount: 6 }, // You can limit the number of files here
  //     ],
  //     multerConfig
  //   )
  // )
  // async sendFile(
  //   @GetReceiver() receiver: User,
  //   @Body() body: { conversationId: string },
  //   @GetUser() user: User,
  //   @UploadedFiles() files: { images?: Express.Multer.File[] }
  //   //  @GetReceiver() receiver:User,
  // ) {
  //   if (!receiver) {
  //     throw new BadRequestException("Receiver not found!");
  //   }
  //   const conversationId = body.conversationId;
  //   const response = await this._messagesService.sendFileAsMessageWithRest({
  //     conversation_id: parseFloat(conversationId),
  //     user,
  //     receiver,
  //     file: files.images,
  //   });
  //   return response;
  // }
}
