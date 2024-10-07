import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Pet } from 'src/pets/entities/pet.entity';
import { User } from 'src/auth/entities/user.entity';
import { MedicalRecord } from 'src/medical_records/entities/medical_record.entity';

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  appointment_id: number;

  @ManyToOne(() => Pet, (pet) => pet.appointments, { onDelete: 'CASCADE' })
  pet: Pet;

  @ManyToOne(() => User, (user) => user.appointments, { onDelete: 'SET NULL' })
  veterinarian: User;

  @Column({ type: 'timestamp' })
  appointment_date: Date;

  @Column({ type: 'text', nullable: true })
  reason: string;

  @Column({ length: 50, default: 'scheduled' })
  status: string;

  @OneToMany(() => MedicalRecord, (medicalRecord) => medicalRecord.appointment)
  medicalRecords: MedicalRecord[];

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
