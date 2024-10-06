import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dtos/create-service.dto';
import { UpdateServiceDto } from './dtos/update-service.dto';

@Controller('services')
export class ServicesController {

    constructor(private readonly servicesService: ServicesService) {}

    @Post('register')
    createService(@Body() createServiceDto: CreateServiceDto) {
        return this.servicesService.createService(createServiceDto);
    }

    @Get()
    async getAllService() {
        return await this.servicesService.findAllService();
    }

    @Get(':id')
    async getServiceById(@Param('id') id: number){
        return await this.servicesService.findServiceById(id)
    }

    @Get('name/:name')
    async getServicesByName(@Param('name') name: string) {
        return await this.servicesService.findServicesByName(name);
    }

    @Patch(':id')
    async updateService(
        @Param('id') id: number,
        @Body() updateServiceDto: UpdateServiceDto,
    ) {
        return await this.servicesService.updateService(id, updateServiceDto);
    }

    @Delete(':id')
    async deleteService(@Param('id') id: number) {
        return await this.servicesService.deleteService(id);
    }

}
