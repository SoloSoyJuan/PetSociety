import { Test, TestingModule } from '@nestjs/testing';
import { PatientsController } from './patients.controller';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dtos/create-patient.dto';
import { UpdatePatientDto } from './dtos/update-patient.dto';
import { NotFoundException } from '@nestjs/common';

describe('PatientsController', () => {
  let controller: PatientsController;
  let service: PatientsService;

  const mockPatientsService = {
    createPatient: jest.fn(),
    findAllPatient: jest.fn(),
    findPatientById: jest.fn(),
    updatePatient: jest.fn(),
    deletePatient: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PatientsController],
      providers: [
        {
          provide: PatientsService,
          useValue: mockPatientsService,
        },
      ],
    }).compile();

    controller = module.get<PatientsController>(PatientsController);
    service = module.get<PatientsService>(PatientsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createPatient', () => {
    it('should create a new patient', async () => {
      const createPatientDto: CreatePatientDto = {
        userId: 1,
        address: '123 Main St',
        phone_number: '555-555-5555',
      };

      const result = { id: 1, ...createPatientDto };
      mockPatientsService.createPatient.mockResolvedValue(result);

      expect(await controller.createPatient(createPatientDto)).toEqual(result);
      expect(mockPatientsService.createPatient).toHaveBeenCalledWith(createPatientDto);
    });
  });

  describe('getAllPatients', () => {
    it('should return an array of patients', async () => {
      const patients = [{ id: 1 }, { id: 2 }];
      mockPatientsService.findAllPatient.mockResolvedValue(patients);

      expect(await controller.getAllPatients()).toEqual(patients);
      expect(mockPatientsService.findAllPatient).toHaveBeenCalled();
    });
  });

  /*
  describe('getPatientById', () => {
    it('should return a patient by ID', async () => {
      const patient = { id: 1, address: '123 Main St', phone_number: '555-555-5555' };
      mockPatientsService.findPatientById.mockResolvedValue(patient);

      expect(await controller.getPatientById(1)).toEqual(patient);
      expect(mockPatientsService.findPatientById).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if patient not found', async () => {
      mockPatientsService.findPatientById.mockResolvedValue(null);
      await expect(controller.getPatientById(1)).rejects.toThrow(NotFoundException);
    });
  });
  */

  describe('updatePatient', () => {
    it('should update and return a patient', async () => {
      const updatePatientDto: UpdatePatientDto = { address: '456 Elm St' };
      const updatedPatient = { id: 1, ...updatePatientDto };

      mockPatientsService.updatePatient.mockResolvedValue(updatedPatient);

      expect(await controller.updatePatient(1, updatePatientDto)).toEqual(updatedPatient);
      expect(mockPatientsService.updatePatient).toHaveBeenCalledWith(1, updatePatientDto);
    });
  });

  describe('deletePatient', () => {
    it('should delete a patient and return a message', async () => {
      const patientId = 1;
      const responseMessage = { message: `Patient with ID ${patientId} successfully deleted` };

      mockPatientsService.deletePatient.mockResolvedValue(responseMessage);

      expect(await controller.deletePatient(patientId)).toEqual(responseMessage);
      expect(mockPatientsService.deletePatient).toHaveBeenCalledWith(patientId);
    });
  });
});
