import { IsDate, IsOptional, IsString } from 'class-validator';

export class UpdateAppointmentDto {
  @IsOptional()
  @IsDate()
  appointment_date?: Date;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  status?: string;
}
