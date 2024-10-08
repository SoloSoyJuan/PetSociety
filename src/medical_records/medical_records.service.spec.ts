import { Test, TestingModule } from '@nestjs/testing';
import { MedicalRecordsService } from './medical_records.service';
import { Repository } from 'typeorm';
import { MedicalRecord } from './entities/medical_record.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateMedicalRecordsDto } from './dtos/create-medical_records.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UpdateMedicalRecords } from './dtos/update-medical_records.dto';
import { PetsService } from '../pets/pets.service';
import { AuthService } from '../auth/auth.service';
import { AppointmentsService } from '../appointments/appointments.service';

const mockMedicalRecordRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
  preload: jest.fn(),
  remove: jest.fn(),
  merge: jest.fn(),
};

const mockPetsService = {
  findPetById: jest.fn(),
};

const mockAuthService = {
  validateUser: jest.fn(),
};

const mockAppointmentsService = {
  findAppointmentById: jest.fn(),
};

describe('MedicalRecordsService', () => {
  let service: MedicalRecordsService;
  let medicalRecordRepository: Repository<MedicalRecord>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MedicalRecordsService,
        {
          provide: getRepositoryToken(MedicalRecord),
          useValue: mockMedicalRecordRepository,
        },
        {
          provide: PetsService,
          useValue: mockPetsService,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: AppointmentsService,
          useValue: mockAppointmentsService,
        },
      ],
    }).compile();

    service = module.get<MedicalRecordsService>(MedicalRecordsService);
    medicalRecordRepository = module.get<Repository<MedicalRecord>>(getRepositoryToken(MedicalRecord));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createMedicalRecord', () => {
    it('should create and return a medical record', async () => {
      const createMedicalRecordDto: CreateMedicalRecordsDto = { petId: 1, veterinarianId: 1, appointmentId: 1, diagnosis: 'diagnosis', treatment: 'treatment', medication: 'medication', notes: 'notes' };
      const savedMedicalRecord = { ...createMedicalRecordDto, record_id: 1 };

      mockMedicalRecordRepository.create.mockReturnValue(savedMedicalRecord);
      mockMedicalRecordRepository.save.mockResolvedValue(savedMedicalRecord);

      const result = await service.createMedicalRecord(createMedicalRecordDto);
      expect(result).toEqual(savedMedicalRecord);
      expect(mockMedicalRecordRepository.create).toHaveBeenCalledWith(createMedicalRecordDto);
      expect(mockMedicalRecordRepository.save).toHaveBeenCalledWith(savedMedicalRecord);
    });

    it('should handle database errors', async () => {
      const createMedicalRecordDto: CreateMedicalRecordsDto = { petId: 1, veterinarianId: 1, appointmentId: 1, diagnosis: 'diagnosis', treatment: 'treatment', medication: 'medication', notes: 'notes' };
      mockMedicalRecordRepository.save.mockRejectedValue({ code: '23505' });

      await expect(service.createMedicalRecord(createMedicalRecordDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAllMedicalRecords', () => {
    it('should return all medical records', async () => {
      const medicalRecords = [{ record_id: 1 }, { record_id: 2 }];
      mockMedicalRecordRepository.find.mockResolvedValue(medicalRecords as any);

      const result = await service.findAllMedicalRecords();
      expect(result).toEqual(medicalRecords);
      expect(mockMedicalRecordRepository.find).toHaveBeenCalled();
    });
  });

  describe('findMedicalRecordById', () => {
    it('should return a medical record by id', async () => {
      const medicalRecord = { record_id: 1 };
      mockMedicalRecordRepository.findOne.mockResolvedValue(medicalRecord as any);

      const result = await service.findMedicalRecordById(1);
      expect(result).toEqual(medicalRecord);
      expect(mockMedicalRecordRepository.findOne).toHaveBeenCalledWith({ where: { record_id: 1 } });
    });

    it('should throw a NotFoundException if medical record not found', async () => {
      mockMedicalRecordRepository.findOne.mockResolvedValue(null);

      await expect(service.findMedicalRecordById(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateMedicalRecord', () => {
    it('should update and return the updated medical record', async () => {
      const medicalRecord = { record_id: 1, notes: 'note' };
      const updateMedicalRecordsDto: UpdateMedicalRecords = { notes: 'updated note' };
      const updatedMedicalRecord = { ...medicalRecord, ...updateMedicalRecordsDto };

      mockMedicalRecordRepository.findOne.mockResolvedValue(medicalRecord as any);
      mockMedicalRecordRepository.merge.mockReturnValue(updatedMedicalRecord as any);
      mockMedicalRecordRepository.save.mockResolvedValue(updatedMedicalRecord);

      const result = await service.updateMedicalRecord(1, updateMedicalRecordsDto);
      expect(result).toEqual(updatedMedicalRecord);
      expect(mockMedicalRecordRepository.merge).toHaveBeenCalledWith(medicalRecord, updateMedicalRecordsDto);
      expect(mockMedicalRecordRepository.save).toHaveBeenCalledWith(updatedMedicalRecord);
    });

    it('should throw a NotFoundException if medical record not found', async () => {
      mockMedicalRecordRepository.findOne.mockResolvedValue(null);

      await expect(service.updateMedicalRecord(1, {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteMedicalRecord', () => {
    it('should delete a medical record', async () => {
      const medicalRecord = { record_id: 1 };
      mockMedicalRecordRepository.findOne.mockResolvedValue(medicalRecord as any);
      mockMedicalRecordRepository.remove.mockResolvedValue(medicalRecord as any);

      const result = await service.deleteMedicalRecords(1);
      expect(result).toEqual({ message: `Medical Record with ID 1 successfully deleted` });
      expect(mockMedicalRecordRepository.remove).toHaveBeenCalledWith(medicalRecord);
    });

    it('should throw a NotFoundException if medical record not found', async () => {
      mockMedicalRecordRepository.findOne.mockResolvedValue(null);

      await expect(service.deleteMedicalRecords(1)).rejects.toThrow(NotFoundException);
    });
  });
});
