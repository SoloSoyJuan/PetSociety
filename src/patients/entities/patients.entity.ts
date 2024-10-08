import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Pet } from 'src/pets/entities/pet.entity';

@Entity('patients')
export class Patient {
  @PrimaryGeneratedColumn('uuid')
  id: number;
  
  @ManyToOne(() => User, (user) => user.patients, { onDelete: 'CASCADE' })
  user: User;

  @Column({ length: 255 })
  address: string;

  @Column({ length: 20 })
  phone_number: string;

  @OneToMany(() => Pet, (pet) => pet.patient)
  pets: Pet[];

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
