import { Body, Delete, Get, Param, Patch, Post, Controller, UseGuards } from '@nestjs/common';
import { MedicalRecordsService } from './medical_records.service';
import { CreateMedicalRecordsDto } from './dtos/create-medical_records.dto';
import { UpdateMedicalRecords } from './dtos/update-medical_records.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('medical-records')
export class MedicalRecordsController {

    constructor(private readonly medicalRecordsService: MedicalRecordsService) {}

    @Post('register')
    createMedicalRecord(@Body() createMedicalRecordDto: CreateMedicalRecordsDto) {
        return this.medicalRecordsService.createMedicalRecord(createMedicalRecordDto);
    }

    @Get()
    async getAllMedicalRecords() {
        return await this.medicalRecordsService.findAllMedicalRecords();
    }

    @Get(':record_id')
    async getMedicalRecordById(@Param('record_id') record_id: number){
        return await this.medicalRecordsService.findMedicalRecordById(record_id)
    }

    @Patch(':record_id')
    async updateMedicalRecord(
        @Param('record_id') record_id: number,
        @Body() updateMedicalRecordDto: UpdateMedicalRecords,
    ) {
        return await this.medicalRecordsService.updateMedicalRecord(record_id, updateMedicalRecordDto);
    }

    @Delete(':record_id')
    async deleteMedicalRecord(@Param('record_id') record_id: number) {
        return await this.medicalRecordsService.deleteMedicalRecords(record_id);
    }

}
