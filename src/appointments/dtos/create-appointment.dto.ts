import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAppointmentDto {
  @IsNotEmpty()
  petId: number;

  @IsOptional()
  veterinarianId: number;

  @IsDate()
  appointment_date: Date;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  status?: string;
}
