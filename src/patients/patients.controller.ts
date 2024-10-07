import { Body, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dtos/create-patient.dto';
import { UpdatePatientDto } from './dtos/update-patient.dto';

@Controller('patients')
export class PatientsController {

    constructor(private readonly patientsService: PatientsService) {}

    @Post('register')
    createPatient(@Body() createPatientDto: CreatePatientDto) {
        return this.patientsService.createPatient(createPatientDto);
    }

    @Get()
    async getAllPatients() {
        return await this.patientsService.findAllPatient();
    }

    @Get(':id')
    async getPatientById(@Param('id') id: number){
        return await this.patientsService.findPatientById(id)
    }

    @Patch(':id')
    async updatePatient(
        @Param('id') id: number,
        @Body() updatePatientDto: UpdatePatientDto,
    ) {
        return await this.patientsService.updatePatient(id, updatePatientDto);
    }

    @Delete(':id')
    async deletePatient(@Param('id') id: number) {
        return await this.patientsService.deletePatient(id);
    }

}
