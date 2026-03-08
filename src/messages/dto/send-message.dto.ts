import { Type } from "class-transformer";
import { IsArray, IsEnum, IsInt, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";
import { AttachmentDto } from "src/attachment/dto/attachments.dto";
import { User } from "src/user/entities/user.entity";
import { MessageDirection } from "../entities/messages.entity";

export class SendMessageDto {
  @IsInt()
  conversation_id: number;

  @IsOptional()
  @IsString()
  msg?: string;
  @IsOptional()
  @IsString()
  sender_phone?: string;
  @IsOptional()
  @IsString()
  sender_email?: string;

  @IsEnum(MessageDirection)
  direction?: MessageDirection;
  @IsOptional()
  @IsString()
  type?: "text" | "image" | "video" | "offer";

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttachmentDto)
  attachments?: AttachmentDto[];
}

export class SendMessageTypes extends SendMessageDto {
  @IsUUID()
  sender: User;
}
