import { Module } from '@nestjs/common';
import { PetsController } from './pets.controller';
import { PetsService } from './pets.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pet } from './entities/pet.entity';
import { PatientsModule } from 'src/patients/patients.module';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pet]),
    PatientsModule,
    AuthModule,
    AuthService
  ],
  controllers: [PetsController],
  providers: [PetsService],
  exports: [PetsService]
})
export class PetsModule {}
