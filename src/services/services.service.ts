import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { Repository } from 'typeorm';
import { CreateServiceDto } from './dtos/create-service.dto';
import { UpdateServiceDto } from './dtos/update-service.dto';

@Injectable()
export class ServicesService {

    constructor(@InjectRepository(Service) private readonly serviceRepository: Repository<Service>){}

    async createService(createServiceDto: CreateServiceDto) {
        try{
            const {...serviceData} = createServiceDto;

            const service = this.serviceRepository.create({
                ...serviceData
            });

            await this.serviceRepository.save(service);

            return service;
        }catch(e){
            this.handleDBErrors(e);
        }
    }

    async findAllService() {
        return await this.serviceRepository.find();
    }

    async findServiceById(id: number) {
        const service = await this.serviceRepository.findOne({ where: { id } });
        if (!service) {
            throw new NotFoundException(`Service with ID ${id} not found`);
        }
        return service;
    }

    async findServicesByName(name: string) {
        const services = await this.serviceRepository.find({ where: { name } });
    
        if (!services.length) {
          throw new NotFoundException(`No services found with the role '${name}'`);
        }
    
        return services;
    }

    async updateService(id: number, updateServiceDto: UpdateServiceDto) {
        const existingService = await this.serviceRepository.findOne({ where: { id } });
     
        if (!existingService) {
           throw new NotFoundException(`Service with ID ${id} not found`);
        }
     
        const updatedService = this.serviceRepository.merge(existingService, updateServiceDto);
     
        try {
           return await this.serviceRepository.save(updatedService);
        } catch (error) {
           this.handleDBErrors(error);
        }
     }

    async deleteService(id: number) {
        const service = await this.findServiceById(id);
        await this.serviceRepository.remove(service);
        return { message: `Service with ID ${id} successfully deleted` };
    }

    private  handleDBErrors(error: any) {
        if(error.code === '23505') {
            throw new BadRequestException('Service already exists');
        }

        throw new InternalServerErrorException('Error creating service');
    }
}
