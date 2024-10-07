import { Module } from '@nestjs/common';
import { MedicalRecordsController } from './medical_records.controller';
import { MedicalRecordsService } from './medical_records.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicalRecord } from './entities/medical_record.entity';
import { AuthModule } from 'src/auth/auth.module';
import { PetsModule } from 'src/pets/pets.module';
import { AppointmentsModule } from 'src/appointments/appointments.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MedicalRecord]),
    AuthModule, PetsModule, AppointmentsModule
  ],
  controllers: [MedicalRecordsController],
  providers: [MedicalRecordsService]
})
export class MedicalRecordsModule {}
