import { IsOptional, IsString, IsPhoneNumber } from 'class-validator';

export class UpdatePatientDto {
  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsPhoneNumber(null)
  phone_number?: string;
}