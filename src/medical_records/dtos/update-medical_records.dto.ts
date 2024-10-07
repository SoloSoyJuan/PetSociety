import { IsDate, IsOptional, IsString } from 'class-validator';

export class UpdateMedicalRecords {
    @IsOptional()
    petId?: number;
    
    @IsOptional()
    veterinarianId?: number;
    
    @IsOptional()
    appointmentId?: number;
    
    @IsOptional()
    @IsString()
    diagnosis?: string;
    
    @IsOptional()
    @IsString()
    treatment?: string;
    
    @IsOptional()
    @IsString()
    medication?: string;
    
    @IsOptional()
    @IsString()
    notes?: string;
}