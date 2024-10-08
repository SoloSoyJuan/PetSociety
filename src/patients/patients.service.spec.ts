import { Test, TestingModule } from '@nestjs/testing';
import { PatientsService } from './patients.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Patient } from './entities/patients.entity';
import { AuthService } from 'src/auth/auth.service';
import { CreatePatientDto } from './dtos/create-patient.dto';
import { UpdatePatientDto } from './dtos/update-patient.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('PatientsService', () => {
  let service: PatientsService;
  let patientRepository: Repository<Patient>;
  let authService: AuthService;

  const mockPatientRepository = {
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    merge: jest.fn(),
  };

  const mockAuthService = {
    findUserById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PatientsService,
        {
          provide: getRepositoryToken(Patient),
          useValue: mockPatientRepository,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    service = module.get<PatientsService>(PatientsService);
    patientRepository = module.get<Repository<Patient>>(getRepositoryToken(Patient));
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createPatient', () => {
    it('should create and return a patient', async () => {
      const createPatientDto: CreatePatientDto = {
        userId: 1,
        address: '123 Main St',
        phone_number: '555-555-5555',
      };

      const user = { id: 1 }; // Mock user object returned from authService
      const savedPatient = { id: 1, ...createPatientDto, user };

      mockAuthService.findUserById.mockResolvedValue(user);
      mockPatientRepository.save.mockResolvedValue(savedPatient);

      const result = await service.createPatient(createPatientDto);
      expect(result).toEqual(savedPatient);
      expect(mockAuthService.findUserById).toHaveBeenCalledWith(createPatientDto.userId);
      expect(mockPatientRepository.save).toHaveBeenCalledWith({ ...createPatientDto, user });
    });
  });

  describe('findAllPatient', () => {
    it('should return an array of patients', async () => {
      const patients = [{ id: 1 }, { id: 2 }];
      mockPatientRepository.find.mockResolvedValue(patients);

      const result = await service.findAllPatient();
      expect(result).toEqual(patients);
      expect(mockPatientRepository.find).toHaveBeenCalled();
    });
  });

  describe('findPatientById', () => {
    it('should return a patient by ID', async () => {
      const patient = { id: 1, address: '123 Main St', phone_number: '555-555-5555' };
      mockPatientRepository.findOne.mockResolvedValue(patient);

      const result = await service.findPatientById(1);
      expect(result).toEqual(patient);
      expect(mockPatientRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException if patient not found', async () => {
      mockPatientRepository.findOne.mockResolvedValue(null);
      await expect(service.findPatientById(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updatePatient', () => {
    it('should update and return the patient', async () => {
      const updatePatientDto: UpdatePatientDto = { address: '456 Elm St' };
      const patient = { id: 1, address: '123 Main St', phone_number: '555-555-5555' };
      const updatedPatient = { ...patient, ...updatePatientDto };

      mockPatientRepository.findOne.mockResolvedValue(patient);
      mockPatientRepository.merge.mockReturnValue(updatedPatient);
      mockPatientRepository.save.mockResolvedValue(updatedPatient);

      const result = await service.updatePatient(1, updatePatientDto);
      expect(result).toEqual(updatedPatient);
      expect(mockPatientRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockPatientRepository.merge).toHaveBeenCalledWith(patient, updatePatientDto);
    });

    it('should throw NotFoundException if patient not found for update', async () => {
      mockPatientRepository.findOne.mockResolvedValue(null);
      await expect(service.updatePatient(999, {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('deletePatient', () => {
    it('should delete a patient and return a message', async () => {
      const patient = { id: 1 };
      mockPatientRepository.findOne.mockResolvedValue(patient);
      mockPatientRepository.remove.mockResolvedValue(patient);

      const result = await service.deletePatient(1);
      expect(result).toEqual({ message: `Patient with ID 1 successfully deleted` });
      expect(mockPatientRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockPatientRepository.remove).toHaveBeenCalledWith(patient);
    });

    it('should throw NotFoundException if patient not found for delete', async () => {
      mockPatientRepository.findOne.mockResolvedValue(null);
      await expect(service.deletePatient(999)).rejects.toThrow(NotFoundException);
    });
  });
});
