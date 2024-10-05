import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Patient } from 'src/patients/entities/patients.entity';
import { Appointment } from 'src/appointments/entities/appointments.entity';
import { MedicalRecord } from 'src/medical_records/entities/medical_record.entity';

@Entity('pets')
export class Pet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 50, nullable: true })
  species: string;

  @Column({ length: 50, nullable: true })
  breed: string;

  @Column({ type: 'date', nullable: true })
  birth_date: Date;

  @Column({ length: 10, nullable: true })
  gender: string;

  @Column({ type: 'numeric', precision: 5, scale: 2, nullable: true })
  weight: number;

  @ManyToOne(() => Patient, (patient) => patient.pets, { onDelete: 'CASCADE' })
  patient: Patient;

  @OneToMany(() => Appointment, (appointment) => appointment.pet)
  appointments: Appointment[];

  @OneToMany(() => MedicalRecord, (medicalRecord) => medicalRecord.pet)
  medicalRecords: MedicalRecord[];

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
