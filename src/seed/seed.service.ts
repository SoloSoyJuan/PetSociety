import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async seed() {
    const adminEmail = 'admin@example.com';
    
    // Buscar si el admin ya existe
    const existingAdmin = await this.userRepository.findOne({ where: { email: adminEmail } });

    // Si existe, borrarlo
    if (existingAdmin) {
      await this.userRepository.remove(existingAdmin);
      console.log('Existing admin user removed');
    }

    // Crear el nuevo admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const newAdmin = this.userRepository.create({
      name: 'Admin',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
    });

    await this.userRepository.save(newAdmin);
    console.log('New admin user seeded');
  }
}