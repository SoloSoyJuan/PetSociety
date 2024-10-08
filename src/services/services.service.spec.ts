import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServicesService } from './services.service';
import { Service } from './entities/service.entity';
import { CreateServiceDto } from './dtos/create-service.dto';
import { UpdateServiceDto } from './dtos/update-service.dto';
import { NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';

describe('ServicesService', () => {
  let service: ServicesService;
  let repo: Repository<Service>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServicesService,
        {
          provide: getRepositoryToken(Service),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ServicesService>(ServicesService);
    repo = module.get<Repository<Service>>(getRepositoryToken(Service));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createService', () => {
    it('should create a service', async () => {
      const createServiceDto: CreateServiceDto = {
        name: 'Test Service',
        description: 'This is a test service description',
        price: 100,
      };
      const savedService: Service = {
        id: 1,
        ...createServiceDto,
        created_at: new Date(),
        updated_at: new Date()
      };
      jest.spyOn(repo, 'create').mockReturnValue(savedService);
      jest.spyOn(repo, 'save').mockResolvedValue(savedService);

      const result = await service.createService(createServiceDto);
      expect(result).toEqual(savedService);
    });

    it('should handle errors', async () => {
      const createServiceDto: CreateServiceDto = {
        name: 'Test Service',
        description: 'This is a test service description',
        price: 100,
      };
      jest.spyOn(repo, 'create').mockReturnValue({} as Service);
      jest.spyOn(repo, 'save').mockRejectedValue({ code: '23505' });

      await expect(service.createService(createServiceDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAllService', () => {
    it('should return an array of services', async () => {
      const services: Service[] = [
        { id: 1, name: 'Service 1', description: 'Description 1', price: 100, created_at: new Date(), updated_at: new Date() },
        { id: 2, name: 'Service 2', description: 'Description 2', price: 200, created_at: new Date(), updated_at: new Date() }
      ];
      jest.spyOn(repo, 'find').mockResolvedValue(services);

      const result = await service.findAllService();
      expect(result).toEqual(services);
    });
  });

  describe('findServiceById', () => {
    it('should return a service by id', async () => {
      const mockService: Service = { 
        id: 1, 
        name: 'Test Service', 
        description: 'Test Description', 
        price: 100, 
        created_at: new Date(), 
        updated_at: new Date() 
      };
      jest.spyOn(repo, 'findOne').mockResolvedValue(mockService);

      const result = await service.findServiceById(1);
      expect(result).toEqual(mockService);
    });

    it('should throw NotFoundException if service not found', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);

      await expect(service.findServiceById(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findServicesByName', () => {
    it('should return services by name', async () => {
      const services: Service[] = [
        { id: 1, name: 'Test Service', description: 'Description 1', price: 100, created_at: new Date(), updated_at: new Date() },
        { id: 2, name: 'Test Service', description: 'Description 2', price: 200, created_at: new Date(), updated_at: new Date() }
      ];
      jest.spyOn(repo, 'find').mockResolvedValue(services);

      const result = await service.findServicesByName('Test Service');
      expect(result).toEqual(services);
    });

    it('should throw NotFoundException if no services found', async () => {
      jest.spyOn(repo, 'find').mockResolvedValue([]);

      await expect(service.findServicesByName('Non-existent Service')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateService', () => {
    it('should update a service', async () => {
      const updateServiceDto: UpdateServiceDto = { name: 'Updated Service' };
      const existingService: Service = { 
        id: 1, 
        name: 'Old Service', 
        description: 'Old description', 
        price: 100, 
        created_at: new Date(), 
        updated_at: new Date() 
      };
      const updatedService: Service = { 
        ...existingService, 
        ...updateServiceDto, 
        updated_at: new Date() 
      };

      jest.spyOn(repo, 'findOne').mockResolvedValue(existingService);
      jest.spyOn(repo, 'merge').mockReturnValue(updatedService);
      jest.spyOn(repo, 'save').mockResolvedValue(updatedService);

      const result = await service.updateService(1, updateServiceDto);
      expect(result).toEqual(updatedService);
    });

    it('should throw NotFoundException if service not found', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);

      await expect(service.updateService(1, {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteService', () => {
    it('should delete a service', async () => {
      const mockService: Service = { 
        id: 1, 
        name: 'Test Service', 
        description: 'Test Description', 
        price: 100, 
        created_at: new Date(), 
        updated_at: new Date() 
      };
      jest.spyOn(service, 'findServiceById').mockResolvedValue(mockService);
      jest.spyOn(repo, 'remove').mockResolvedValue(mockService);

      const result = await service.deleteService(1);
      expect(result).toEqual({ message: 'Service with ID 1 successfully deleted' });
    });
  });
});