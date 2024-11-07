import { Body, Delete, Get, Param, Patch, Post, Controller, UseGuards } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dtos/create-patient.dto';
import { UpdatePatientDto } from './dtos/update-patient.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('patients')
export class PatientsController {

    constructor(private readonly patientsService: PatientsService) {}

    @Post('register')
    createPatient(@Body() createPatientDto: CreatePatientDto) {
        return this.patientsService.createPatient(createPatientDto);
    }

    @Get()
    @Roles('admin', 'vet')
    async getAllPatients() {
        return await this.patientsService.findAllPatient();
    }

    @Get(':id')
    @Roles('admin', 'vet', 'owner')
    async getPatientById(@Param('id') id: number){
        return await this.patientsService.findPatientById(id)
    }

    @Patch(':id')
    @Roles('admin', 'vet')
    async updatePatient(
        @Param('id') id: number,
        @Body() updatePatientDto: UpdatePatientDto,
    ) {
        return await this.patientsService.updatePatient(id, updatePatientDto);
    }

    @Delete(':id')
    @Roles('admin')
    async deletePatient(@Param('id') id: number) {
        return await this.patientsService.deletePatient(id);
    }

}
