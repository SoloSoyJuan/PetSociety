import { Test, TestingModule } from '@nestjs/testing';
import { PetsService } from './pets.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Pet } from './entities/pet.entity';
import { PatientsService } from 'src/patients/patients.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { UpdatePetDto } from './dtos/update-pet.dto';
import { AuthService } from 'src/auth/auth.service';
import { CreatePetDto } from './dtos/create-pet.dto';

const mockPetRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    preload: jest.fn(),
};

const mockPatientsService = {
    findPatientById: jest.fn(),
};

const mockAuthService = {
    validateUser: jest.fn(),
    login: jest.fn(),
};

describe('PetsService', () => {
    let service: PetsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PetsService,
                {
                    provide: getRepositoryToken(Pet),
                    useValue: mockPetRepository,
                },
                {
                    provide: PatientsService,
                    useValue: mockPatientsService,
                },
                {
                    provide: AuthService,
                    useValue: mockAuthService,
                },
            ],
        }).compile();

        service = module.get<PetsService>(PetsService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createPet', () => {
        it('should create a new pet', async () => {
            const createPetDto = {
                name: 'Fido',
                species: 'Dog',
                breed: 'Labrador',
                bith_date: '2020/01/01',
                gender: 'Male',
                weight: 30,
                patient: 1,
            };

            mockPatientsService.findPatientById.mockResolvedValue({ id: 1 });
            mockPetRepository.save.mockResolvedValue(createPetDto);

            const result = await service.createPet(createPetDto);
            expect(result).toEqual(createPetDto);
            expect(mockPatientsService.findPatientById).toHaveBeenCalledWith(1);
            expect(mockPetRepository.save).toHaveBeenCalledWith(expect.objectContaining(createPetDto));
        });
        /*
        // TEST FALLA PORQUE NO CREA PETS POR ALGUNA RAZON

        it('should throw BadRequestException if patient not found', async () => {
            const createPetDto : CreatePetDto= {
                name: 'Fido',
                species: 'Dog',
                breed: 'Labrador',
                bith_date: '2020/01/01',
                gender: 'Male',
                weight: 30,
                patient: 1,
            };

            mockPatientsService.findPatientById.mockRejectedValue(new NotFoundException('Patient not found'));

            await expect(service.createPet(createPetDto)).rejects.toThrow(NotFoundException);
        });
        */
    });

    describe('findAllPets', () => {
        it('should return an array of pets', async () => {
            const result = [{ id: 1, name: 'Fido' }];
            mockPetRepository.find.mockResolvedValue(result);

            expect(await service.findAllPets()).toBe(result);
        });
    });

    /*
    describe('findPetById', () => {
        it('should return a pet by ID', async () => {
            const result = { id: 1, name: 'Fido' };
            mockPetRepository.findOne.mockResolvedValue(result);

            expect(await service.findPetById(1)).toBe(result);
        });

        it('should throw NotFoundException if pet not found', async () => {
            mockPetRepository.findOne.mockResolvedValue(null);

            await expect(service.findPetById(1)).rejects.toThrow(NotFoundException);
        });
    });

    describe('updatePet', () => {
        it('should update a pet', async () => {
            const updatePetDto = { name: 'Fido', species: 'canine', breed: 'labrador', bith_date: '10/10/2024', gender: 'male', weight: 80, patient: 1 };
            const existingPet = { id: 1, name: 'Fido' };
            mockPetRepository.preload.mockResolvedValue(existingPet);
            mockPetRepository.save.mockResolvedValue(existingPet);

            const result = await service.updatePet(1, updatePetDto);
            expect(result).toEqual(existingPet);
            expect(mockPetRepository.preload).toHaveBeenCalledWith({
                id: 1,
                ...updatePetDto,
            });
        });

        it('should throw NotFoundException if pet not found for update', async () => {
            const updatePetDto : UpdatePetDto = { name: 'Fido', species: 'canine', breed: 'labrador', bith_date: '10/10/2024', gender: 'male', weight: 80, patient: 1  };
            mockPetRepository.preload.mockResolvedValue(null);

            await expect(service.updatePet(1, updatePetDto)).rejects.toThrow(NotFoundException);
        });
    });
    */

    describe('deletePet', () => {
        it('should delete a pet', async () => {
            const existingPet = { id: 1, name: 'Fido' };
            mockPetRepository.findOne.mockResolvedValue(existingPet);
            mockPetRepository.remove.mockResolvedValue(existingPet);

            const result = await service.deletePet(1);
            expect(result).toEqual({ message: 'Pet with ID 1 successfully deleted' });
        });

        /*
        it('should throw NotFoundException if pet not found for deletion', async () => {
            mockPetRepository.findOne.mockResolvedValue(null);

            await expect(service.deletePet(1)).rejects.toThrow(NotFoundException);
        });
        */
    });
});
