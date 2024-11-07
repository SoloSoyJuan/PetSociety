import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MedicalRecord } from './entities/medical_record.entity';
import { Repository } from 'typeorm';
import { CreateMedicalRecordsDto } from './dtos/create-medical_records.dto';
import { PetsService } from 'src/pets/pets.service';
import { AuthService } from 'src/auth/auth.service';
import { AppointmentsService } from 'src/appointments/appointments.service';
import { UpdateMedicalRecords } from './dtos/update-medical_records.dto';

@Injectable()
export class MedicalRecordsService {

    constructor(
        @InjectRepository(MedicalRecord) private readonly medicalRecordRepository: Repository<MedicalRecord>,
        private readonly petService: PetsService,
        private readonly authService: AuthService,
        private readonly appointmentsService: AppointmentsService
    ){}

    async createMedicalRecord(createMedicalRecordDto: CreateMedicalRecordsDto) {
        try {
            const thePet = await this.petService.findPetById(createMedicalRecordDto.petId);
            const pet = thePet[0];
            const veterinarian = await this.authService.findUserById(createMedicalRecordDto.veterinarianId);
            const appointment = await this.appointmentsService.findAppointmentById(createMedicalRecordDto.appointmentId);

            const newMedicalRecord = Object.assign({ ...createMedicalRecordDto, pet, veterinarian, appointment });
            return this.medicalRecordRepository.save(newMedicalRecord);
        
        } catch (err) {
            this.handleDBErrors(err);
        }   
    }

    async findAllMedicalRecords() {
        return await this.medicalRecordRepository.find({relations: ['veterinarian', 'pet', 'appointment']});
    }

    async findMedicalRecordById(record_id: number) {
        const medicalRecord = await this.medicalRecordRepository.findOne({ where: { record_id }, relations: ['veterinarian', 'pet', 'appointment'] });
        if (!medicalRecord) {
            throw new NotFoundException(`Medical Record with ID ${record_id} not found`);
        }
        return medicalRecord;
    }

    async updateMedicalRecord(record_id: number, updateMedicalRecords: UpdateMedicalRecords) {
        const medicalRecord = await this.medicalRecordRepository.findOne({ where: { record_id } });
     
        if (!medicalRecord) {
           throw new NotFoundException(`Medical Record with ID ${record_id} not found`);
        }
     
        const updatedMedicalReport = this.medicalRecordRepository.merge(medicalRecord, updateMedicalRecords);
     
        try {
           return await this.medicalRecordRepository.save(updatedMedicalReport);
        } catch (error) {
           this.handleDBErrors(error);
        }
     }

    async deleteMedicalRecords(record_id: number) {
        const medicalRecord = await this.findMedicalRecordById(record_id);
        await this.medicalRecordRepository.remove(medicalRecord);
        return { message: `Medical Record with ID ${record_id} successfully deleted` };
    }

    private  handleDBErrors(error: any) {
        if(error.code === '23505') {
            throw new BadRequestException('Medical Record already exists');
        }

        throw new InternalServerErrorException('Error creating Medical Record');
    }

}