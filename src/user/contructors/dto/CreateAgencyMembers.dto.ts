import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, MinLength } from "class-validator";

export class CreateMemberDto {
  @ApiProperty({ example: "John" })
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({ example: "Doe" })
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @ApiProperty({ example: "constructor@agency.com" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "strongPassword123!", minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: "+1234567890", required: false })
  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @ApiProperty({ example: "https://image.com/avatar.jpg", required: false })
  @IsOptional()
  @IsString()
  image?: string;
}
