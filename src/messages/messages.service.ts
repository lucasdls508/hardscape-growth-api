import { InjectQueue } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Queue } from "bullmq";
import { AttachmentService } from "src/attachment/attachment.service";
import { MESSAGE_QUEUE, UPDATE_CONVERSATION_JOB } from "src/bull/processors/messageQueue";
import { ChatbotService } from "src/chatbot/chatbot.service";
import { ConversationsService } from "src/conversations/conversations.service";
import { MetaBuisnessProfiles } from "src/page_session/entites/meta_buisness.entity";
import { ConversationParticipant } from "src/participants/entities/participants.entity";
import { RedisService } from "src/redis/redis.service";
import { InjectLogger } from "src/shared/decorators/logger.decorator";
import { SocketService } from "src/socket/socket.service";
import { UserService } from "src/user/user.service";
import { Repository } from "typeorm";
import { Logger } from "winston";
import { SendMessageTypes } from "./dto/send-message.dto";
import { MessageDirection, Messages } from "./entities/messages.entity";

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Messages)
    private _messageRepo: Repository<Messages>,
    private readonly _conversationService: ConversationsService,
    private readonly _userService: UserService,
    private readonly _attachmentService: AttachmentService,
    private readonly _socketService: SocketService,
    @InjectLogger() private readonly _logger: Logger,
    private readonly _redisService: RedisService,
    @InjectQueue(MESSAGE_QUEUE) private readonly _messageQueue: Queue,
    private readonly _chatService: ChatbotService
  ) {}
  async sendMessage(dto: SendMessageTypes): Promise<Messages> {
    try {
      const conversation = await this._conversationService.getCachedConversation(dto.conversation_id);
      console.log(conversation);
      console.log(dto);
      let message;
      if (dto.direction === MessageDirection.OUTBOUND) {
        message = this._messageRepo.create({
          msg: dto.msg,
          direction: dto.direction,
          type: dto.type ? dto.type : "text",
          sender_user: dto.sender,
          sender_phone: dto.sender_phone,
          // sender_email: dto.sender_email,
          conversation,
          isRead: false,
        });
        console.log(message);
      } else {
        message = this._messageRepo.create({
          msg: dto.msg,
          direction: dto.direction,
          type: dto.type ? dto.type : "text",
          sender_user: dto.sender,
          conversation,
          isRead: false,
        });
      }
      this._logger.log("Message Service", message);
      const savedMessage = await this._messageRepo.save(message);
      // conversation.lastmsg = savedMessage;
      await this._conversationService.updateLastMessage(conversation, savedMessage);
      await this._messageQueue.add(
        UPDATE_CONVERSATION_JOB,
        {
          conversation_id: conversation.id,
          message,
        },
        {
          attempts: 3,
          backoff: { type: "exponential", delay: 1000 },
          removeOnComplete: true,
          removeOnFail: false,
        }
      );

      // Invalidate conversation cache so next fetch gets fresh lastmsg
      await this._redisService.delCache(
        this._conversationService.CONVERSATION_CACHE_KEY(dto.conversation_id)
      );

      return savedMessage;
    } catch (error) {
      this._logger.error("MessagesService.sendMessage failed", error);
      throw error;
    }
  }
  async getMessages({
    conversationId,
    page,
    limit,
  }: {
    conversationId: number;
    page: number;
    limit: number;
  }) {
    const cacheKey = `messages:${conversationId}:page:${page}:limit:${limit}`;

    const cached = await this._redisService.getCache(cacheKey);
    if (cached) return cached;

    const [messages, total] = await this._messageRepo.findAndCount({
      where: { conversation: { id: conversationId } },
      order: { created_at: "DESC" },
      skip: (page - 1) * limit,
      take: limit,
    });

    const conversation = await this._conversationService.getCachedConversation(conversationId);

    const result = {
      data: messages,
      conversation,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };

    // Cache paginated results briefly — invalidate on new message
    await this._redisService.setCacheWithTTL(cacheKey, result, 30);

    return result;
  }

  async sendMessageWithAI(
    dto: SendMessageTypes,
    userInfo: MetaBuisnessProfiles,
    chat: ConversationParticipant[]
  ) {
    try {
      // 1. Save the user's message first
      const userMessage = await this.sendMessage(dto);
      console.log(userInfo);
      // 2. Process through AI (chatRaw handles context, memory, extraction)
      const aiResponse = await this._chatService.chatRaw(String(dto.conversation_id), dto.msg, userInfo);

      // 3. Save AI response as a new message in the same conversation
      const aiMessageDto: SendMessageTypes = {
        conversation_id: dto.conversation_id,
        msg: aiResponse.message,
        direction: MessageDirection.INBOUND, // AI response comes "in" to the user
        type: "text",
        sender: null, // null = system/bot sender
      };

      const aiMessage = await this.sendMessage(aiMessageDto);

      // 4. Emit AI response via socket so client gets it in real-time
      // await this._socketService.emitToConversation(dto.conversation_id, {
      //   event: "ai_message",
      //   data: {
      //     message: aiMessage,
      //     nextAction: aiResponse.nextAction,
      //     suggestedQuestions: aiResponse.suggestedQuestions,
      //     collectedFields: Object.fromEntries(aiResponse.collectedFields),
      //   },
      // });

      // 5. If AI determined a terminal status, optionally queue a follow-up job
      if (aiResponse.nextAction === "complete") {
        await this._messageQueue.add(
          "conversation-completed",
          {
            conversation_id: dto.conversation_id,
            collectedData: Object.fromEntries(aiResponse.collectedFields),
          },
          {
            attempts: 3,
            backoff: { type: "exponential", delay: 1000 },
            removeOnComplete: true,
          }
        );
      }

      // Return the user's original message to the caller
      return { userMessage, aiMessage };
    } catch (error) {
      this._logger.error("MessagesService.sendMessageWithAI failed", { dto, error });
      throw error;
    }
  }
  // Call this after a new message is saved to bust paginated cache
  private async invalidateMessageListCache(conversationId: number) {
    await this._redisService.deleteByPattern(`messages:${conversationId}:*`);
  }

  // async seenMessages({ conversation_id }: { conversation_id: number }) {
  //   const updateResult = await this._messageRepo
  //     .createQueryBuilder()
  //     .update(Messages)
  //     .set({ isRead: true })
  //     .where("conversation_id = :conversation_id", { conversation_id })
  //     .andWhere("isRead = false")
  //     .execute();
  //   return {
  //     message: `${updateResult.affected} message(s) marked as read`,
  //   };
  // }
  // async sendFileAsMessageWithRest({
  //   conversation_id,
  //   user,
  //   file,
  //   receiver,
  // }: {
  //   conversation_id: number;
  //   receiver: User;
  //   user: User;
  //   file: Express.Multer.File[];
  // }) {
  //   // console.log(this._socketService.connectedUsers);
  //   if (file.length < 1) {
  //     throw new BadRequestException("Please select a file to send");
  //   }
  //   // console.log(file);
  //   const images = file.map((singleFile) => {
  //     return {
  //       file_url: `${singleFile.destination.slice(7, singleFile.destination.length)}/${singleFile.filename}`,
  //       type: singleFile.mimetype,
  //     };
  //   });
  //   const msgType: "image" | "video" =
  //     images[0].type.includes("image") || images[0].type.includes("octet-stream") ? "image" : "video";
  //   const msg = await this.sendMessage({
  //     conversation_id,
  //     sender: user,
  //     attachments: images,
  //     type: msgType,
  //   });
  //   //  console.log("first")
  //   await this._conversationService.updatedConversation({ conversation_id, message: msg });
  //   const receiverSocket = this._socketService.getSocketByUserId(receiver.id);
  //   // console.log(this._socketService)
  //   const senderSocket = this._socketService.getSocketByUserId(user.id);
  //   if (receiverSocket) {
  //     receiverSocket.emit(`conversation-${conversation_id}`, msg);
  //   }
  //   if (senderSocket) {
  //     senderSocket.emit(`conversation-${conversation_id}`, msg);
  //   }
  //   return msg;
  // }
  // async getMessages({
  //   conversationId,
  //   conversation,
  //   receiver,
  //   page = 1,
  //   limit = 10,
  // }: {
  //   conversationId: number;
  //   receiver: Partial<User>;
  //   conversation: Conversations;
  //   page: number;
  //   limit: number;
  // }): Promise<
  //   ResponseInterface<{ receiver: Partial<User>; conversation: Conversations; messages: Messages[] }>
  // > {
  //   const [messages, total] = await this._messageRepo.findAndCount({
  //     where: { conversation: { id: conversationId } },
  //     relations: ["attachments", "offer"],
  //     order: { created_at: "DESC" },
  //     // skip: skip,
  //     // take: take,
  //   });
  //   const lastmsg = messages[messages.length - 1];
  //   // console.log(receiver, messages[messages.length-1].sender_id)
  //   if (receiver.id !== lastmsg.sender_id) {
  //     console.log("receiver and lastmsg sender are not same");
  //     await this.seenMessages({ conversation_id: conversationId });
  //   }
  //   // If no messages are found
  //   if (messages.length === 0) {
  //     throw new NotFoundException("No messages found for this conversation");
  //   }
  //   return {
  //     status: "success",
  //     message: "Messages retrived successfully",
  //     statusCode: 200,
  //     data: { receiver, conversation, messages },
  //     pagination: pagination({ page, limit, total }),
  //   };
  // }
}
