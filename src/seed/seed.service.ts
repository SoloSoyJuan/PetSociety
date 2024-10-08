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
    const adminExists = await this.userRepository.findOne({ where: { email: 'admin@example.com' } });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await this.userRepository.save({
        name: 'Admin',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
      });
      console.log('Admin user seeded');
    }
  }
}