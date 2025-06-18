import { Base } from '@/lib/interface';

export interface DoctorType extends Base {
  name: string;
  email: string;
  phone: string;
  designation: string;
  department: string;
  sitting?: string;
  experience: string;
  education: string;
  patients: number;
  biography: string;
  image: string;
  shortbio: string;
  uid: number;
  seating: string;
}
