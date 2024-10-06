import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Patient } from 'src/patients/entities/patients.entity';
import { Appointment } from 'src/appointments/entities/appointments.entity';
import { MedicalRecord } from 'src/medical_records/entities/medical_record.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column('text')
  name: string;

  @Column('text', { unique: true })
  email: string;

  @Column('text', {select: false})
  password: string;

  @Column('text', {default:'owner'})
  role: string;

  @OneToMany(() => Patient, (patient) => patient.user)
  patients: Patient[];

  @OneToMany(() => Appointment, (appointment) => appointment.veterinarian)
  appointments: Appointment[];

  @OneToMany(() => MedicalRecord, (medicalRecord) => medicalRecord.veterinarian)
  medicalRecords: MedicalRecord[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
