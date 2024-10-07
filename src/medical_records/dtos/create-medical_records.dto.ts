import { IsDate, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateMedicalRecordsDto {
  @IsNotEmpty()
  petId: number;

  @IsNotEmpty()
  veterinarianId: number;

  @IsNotEmpty()
  appointmentId: number;

  @IsString()
  @MinLength(20)
  diagnosis: string;

  @IsString()
  @MinLength(5)
  treatment: string;

  @IsString()
  medication: string;

  @IsString()
  notes: string;
}