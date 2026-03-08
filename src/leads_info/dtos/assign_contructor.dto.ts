import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class AssignConstructorDto {
  @ApiProperty({
    example: "550e8400-e29b-41d4-a716-446655440000",
    description: "Constructor user ID",
  })
  @IsUUID()
  constructor_id: string;
}
