import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Pet } from 'src/pets/entities/pet.entity';
import { User } from 'src/auth/entities/user.entity';
import { Appointment } from 'src/appointments/entities/appointments.entity';

@Entity('medical_records')
export class MedicalRecord {
  @PrimaryGeneratedColumn('uuid')
  record_id: number;

  @ManyToOne(() => Pet, (pet) => pet.medicalRecords, { onDelete: 'CASCADE' })
  pet: Pet;

  @ManyToOne(() => User, (user) => user.medicalRecords, { onDelete: 'SET NULL' })
  veterinarian: User;

  @ManyToOne(() => Appointment, (appointment) => appointment.medicalRecords, { onDelete: 'SET NULL' })
  appointment: Appointment;

  @Column({ type: 'text', nullable: true })
  diagnosis: string;

  @Column({ type: 'text', nullable: true })
  treatment: string;

  @Column({ type: 'text', nullable: true })
  medication: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
