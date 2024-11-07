import { User } from "src/auth/entities/user.entity";

export class PatientDto {
  id: string;
  address: string;
  phone_number: string;
  created_at: Date;
  updated_at: Date;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
    created_at: Date;
    updated_at: Date;
  };
}
