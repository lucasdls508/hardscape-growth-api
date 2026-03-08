import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, IsUrl, MaxLength } from "class-validator";

export class UpdateAgencyProfileDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  agency_name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  contact_email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  facebook_page_link?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ein?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  nid_no?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  nid_front?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  nid_back?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tax_no?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tax_id_front?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tax_id_back?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  contact_phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  logo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  address?: string;
}
