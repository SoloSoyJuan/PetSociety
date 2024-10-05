import { Module } from '@nestjs/common';
import { MedicalRecordsController } from './medical_records.controller';
import { MedicalRecordsService } from './medical_records.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicalRecord } from './entities/medical_record.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([MedicalRecord])
  ],
  controllers: [MedicalRecordsController],
  providers: [MedicalRecordsService]
})
export class MedicalRecordsModule {}
