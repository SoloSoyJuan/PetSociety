import { Test, TestingModule } from '@nestjs/testing';
import { MedicalRecordsController } from './medical_records.controller';
import { MedicalRecordsService } from './medical_records.service';
import { CreateMedicalRecordsDto } from './dtos/create-medical_records.dto';
import { UpdateMedicalRecords } from './dtos/update-medical_records.dto';

const mockMedicalRecordsService = {
  createMedicalRecord: jest.fn(),
  findAllMedicalRecords: jest.fn(),
  findMedicalRecordById: jest.fn(),
  updateMedicalRecord: jest.fn(),
  deleteMedicalRecords: jest.fn(),
};

describe('MedicalRecordsController', () => {
  let controller: MedicalRecordsController;
  let service: MedicalRecordsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MedicalRecordsController],
      providers: [
        {
          provide: MedicalRecordsService,
          useValue: mockMedicalRecordsService,
        },
      ],
    }).compile();

    controller = module.get<MedicalRecordsController>(MedicalRecordsController);
    service = module.get<MedicalRecordsService>(MedicalRecordsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new medical record', async () => {
      const createMedicalRecordDto: CreateMedicalRecordsDto = { petId: 1, veterinarianId: 1, appointmentId: 1, diagnosis: 'diagnosis', treatment: 'treatment', medication: 'medication', notes: 'notes' };
      const createdMedicalRecord = { record_id: 1, ...createMedicalRecordDto };
      
      mockMedicalRecordsService.createMedicalRecord.mockResolvedValue(createdMedicalRecord);

      const result = await controller.createMedicalRecord(createMedicalRecordDto);
      expect(result).toEqual(createdMedicalRecord);
      expect(mockMedicalRecordsService.createMedicalRecord).toHaveBeenCalledWith(createMedicalRecordDto);
    });
  });

  describe('findAll', () => {
    it('should return all medical records', async () => {
      const medicalRecords = [{ record_id: 1 }, { record_id: 2 }];
      mockMedicalRecordsService.findAllMedicalRecords.mockResolvedValue(medicalRecords);

      const result = await controller.getAllMedicalRecords();
      expect(result).toEqual(medicalRecords);
      expect(mockMedicalRecordsService.findAllMedicalRecords).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single medical record by id', async () => {
      const medicalRecord = { record_id: 1 };
      mockMedicalRecordsService.findMedicalRecordById.mockResolvedValue(medicalRecord);

      const result = await controller.getMedicalRecordById(1);
      expect(result).toEqual(medicalRecord);
      expect(mockMedicalRecordsService.findMedicalRecordById).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a medical record', async () => {
      const updateMedicalRecordsDto: UpdateMedicalRecords = { notes: 'updated notes' };
      const updatedMedicalRecord = { record_id: 1, ...updateMedicalRecordsDto };

      mockMedicalRecordsService.updateMedicalRecord.mockResolvedValue(updatedMedicalRecord);

      const result = await controller.updateMedicalRecord(1, updateMedicalRecordsDto);
      expect(result).toEqual(updatedMedicalRecord);
      expect(mockMedicalRecordsService.updateMedicalRecord).toHaveBeenCalledWith(1, updateMedicalRecordsDto);
    });
  });

  describe('delete', () => {
    it('should delete a medical record', async () => {
      const response = { message: `Medical Record with ID 1 successfully deleted` };
      mockMedicalRecordsService.deleteMedicalRecords.mockResolvedValue(response);

      const result = await controller.deleteMedicalRecord(1);
      expect(result).toEqual(response);
      expect(mockMedicalRecordsService.deleteMedicalRecords).toHaveBeenCalledWith(1);
    });
  });
});
