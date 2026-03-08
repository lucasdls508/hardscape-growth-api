import { IsDateString, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from "class-validator";

export class CreateAppointmentDto {
  @IsUUID()
  // @IsNotEmpty()
  @IsOptional()
  constructor_id: string; // matches the entity (corrected spelling)

  @IsUUID()
  @IsNotEmpty()
  lead_id: string;

  @IsString()
  // @IsNotEmpty()
  @IsOptional()
  @MaxLength(255)
  lead_contact: string;

  @IsDateString()
  @IsNotEmpty()
  start_time: string;

  @IsDateString()
  @IsNotEmpty()
  end_time: string;
}
