import { Test, TestingModule } from '@nestjs/testing';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dtos/create-service.dto';
import { UpdateServiceDto } from './dtos/update-service.dto';
import { Service } from './entities/service.entity';

describe('ServicesController', () => {
  let controller: ServicesController;
  let service: ServicesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServicesController],
      providers: [
        {
          provide: ServicesService,
          useValue: {
            createService: jest.fn(),
            findAllService: jest.fn(),
            findServiceById: jest.fn(),
            findServicesByName: jest.fn(),
            updateService: jest.fn(),
            deleteService: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ServicesController>(ServicesController);
    service = module.get<ServicesService>(ServicesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createService', () => {
    it('should create a service', async () => {
      const createServiceDto: CreateServiceDto = {
        name: 'Test Service',
        description: 'This is a test service',
        price: 100,
      };
      const createdService: Service = {
        id: 1,
        ...createServiceDto,
        created_at: new Date(),
        updated_at: new Date(),
      };
      jest.spyOn(service, 'createService').mockResolvedValue(createdService);

      const result = await controller.createService(createServiceDto);
      expect(result).toEqual(createdService);
      expect(service.createService).toHaveBeenCalledWith(createServiceDto);
    });
  });

  describe('getAllService', () => {
    it('should return an array of services', async () => {
      const services: Service[] = [
        { id: 1, name: 'Service 1', description: 'Description 1', price: 100, created_at: new Date(), updated_at: new Date() },
        { id: 2, name: 'Service 2', description: 'Description 2', price: 200, created_at: new Date(), updated_at: new Date() },
      ];
      jest.spyOn(service, 'findAllService').mockResolvedValue(services);

      const result = await controller.getAllService();
      expect(result).toEqual(services);
      expect(service.findAllService).toHaveBeenCalled();
    });
  });

  describe('getServiceById', () => {
    it('should return a service by id', async () => {
      const mockService: Service = {
        id: 1,
        name: 'Test Service',
        description: 'Test Description',
        price: 100,
        created_at: new Date(),
        updated_at: new Date(),
      };
      jest.spyOn(service, 'findServiceById').mockResolvedValue(mockService);

      const result = await controller.getServiceById(1);
      expect(result).toEqual(mockService);
      expect(service.findServiceById).toHaveBeenCalledWith(1);
    });
  });

  describe('getServicesByName', () => {
    it('should return services by name', async () => {
      const services: Service[] = [
        { id: 1, name: 'Test Service', description: 'Description 1', price: 100, created_at: new Date(), updated_at: new Date() },
        { id: 2, name: 'Test Service', description: 'Description 2', price: 200, created_at: new Date(), updated_at: new Date() },
      ];
      jest.spyOn(service, 'findServicesByName').mockResolvedValue(services);

      const result = await controller.getServicesByName('Test Service');
      expect(result).toEqual(services);
      expect(service.findServicesByName).toHaveBeenCalledWith('Test Service');
    });
  });

  describe('updateService', () => {
    it('should update a service', async () => {
      const updateServiceDto: UpdateServiceDto = { name: 'Updated Service' };
      const updatedService: Service = {
        id: 1,
        name: 'Updated Service',
        description: 'Old description',
        price: 100,
        created_at: new Date(),
        updated_at: new Date(),
      };
      jest.spyOn(service, 'updateService').mockResolvedValue(updatedService);

      const result = await controller.updateService(1, updateServiceDto);
      expect(result).toEqual(updatedService);
      expect(service.updateService).toHaveBeenCalledWith(1, updateServiceDto);
    });
  });

  describe('deleteService', () => {
    it('should delete a service', async () => {
      const deleteResult = { message: 'Service with ID 1 successfully deleted' };
      jest.spyOn(service, 'deleteService').mockResolvedValue(deleteResult);

      const result = await controller.deleteService(1);
      expect(result).toEqual(deleteResult);
      expect(service.deleteService).toHaveBeenCalledWith(1);
    });
  });
});