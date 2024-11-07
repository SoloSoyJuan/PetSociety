import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Patient } from './entities/patients.entity';
import { Repository } from 'typeorm';
import { AuthService } from 'src/auth/auth.service';
import { CreatePatientDto } from './dtos/create-patient.dto';
import { UpdatePatientDto } from './dtos/update-patient.dto';

@Injectable()
export class PatientsService {

    constructor(
        @InjectRepository(Patient)
        private readonly patientRepository: Repository<Patient>,
    
        private readonly authService: AuthService,
    ) {}

    async createPatient(createPatientDto: CreatePatientDto) {
        const user = await this.authService.findUserById(createPatientDto.userId);
        const newPatient = Object.assign({ ...createPatientDto, user });
        return this.patientRepository.save(newPatient);
    }

    async findAllPatient(): Promise<Patient[]> {
        return await this.patientRepository.find({ relations: ['user', 'pets'] });
    }    

    async findPatientById(id: number) {
        const patient = await this.patientRepository.findOne({ where: { id }, relations: ['user', 'pets']});
        if(!patient) {
            throw new NotFoundException(`Patient with ID ${id} not found`)
        }
        return patient;
    }

    async updatePatient(id: number, updatePatientDto: UpdatePatientDto) {
        const patient = await this.patientRepository.findOne({ where: { id } });
        
        if(!patient) {
            throw new NotFoundException(`Patient with ID ${id} not found`);
        }

        const updatedPatient = this.patientRepository.merge(patient, updatePatientDto);

        try {
            return await this.patientRepository.save(updatedPatient);
        } catch (e) {
            this.handleDBErrors(e);
        }
    }

    async deletePatient(id: number) {
        const patient = await this.findPatientById(id);
        await this.patientRepository.remove(patient);
        return { message: `Patient with ID ${id} successfully deleted` };
    }

    private  handleDBErrors(error: any) {
        if(error.code === '23505') {
            throw new BadRequestException('Patient already exists');
        }

        throw new InternalServerErrorException('Error creating patient');
    }

}
