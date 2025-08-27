import { Base } from '@/lib/interface';

export interface DoctorType extends Base {
  uid: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  image: string;
  specialization?: string;
  designation?: string;
  department?: string;
  experience?: string;
  education?: string;
  biography?: string;
  shortbio?: string;
  seating?: string;
}

export type DoctorCreationType = 'existing' | 'new';

export type CreateDoctorType = Pick<
  DoctorType,
  | 'uid'
  | 'name'
  | 'email'
  | 'phone'
  | 'gender'
  | 'image'
  | 'designation'
  | 'department'
  | 'seating'
  | 'experience'
  | 'education'
  | 'biography'
  | 'shortbio'
> & {
  creation_type: DoctorCreationType;
};
