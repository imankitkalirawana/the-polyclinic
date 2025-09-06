import { Base } from '@/types';

export interface DoctorType extends Base {
  uid: string;
  name: string;
  email: string;
  phone: string;
  image: string;
  specialization?: string;
  designation?: string;
  department?: string;
  experience?: string;
  education?: string;
  biography?: string;
  seating?: string;
}
