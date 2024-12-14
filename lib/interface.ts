export interface Base {
  _id: string;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  admin = 'admin',
  doctor = 'doctor',
  nurse = 'nurse',
  receptionist = 'receptionist',
  pharmacist = 'pharmacist',
  laboratorist = 'laboratorist',
  user = 'user'
}

export enum UserStatus {
  active = 'active',
  inactive = 'inactive',
  blocked = 'blocked',
  deleted = 'deleted'
}

export interface User extends Base {
  uid: number;
  email: string;
  phone: string;
  password: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  country: string;
  state: string;
  city: string;
  address: string;
  zipcode: string;
  passwordResetToken: string;
  dob: string;
  gender: 'male' | 'female' | 'other';
  image: string;
}

export enum ServiceType {
  'medical',
  'surgical',
  'diagnostic',
  'consultation'
}

export const ServiceTypes = [
  {
    label: 'Medical',
    value: 'medical'
  },
  {
    label: 'Surgical',
    value: 'surgical'
  },
  {
    label: 'Diagnostic',
    value: 'diagnostic'
  },
  {
    label: 'Consultation',
    value: 'consultation'
  }
];

export enum ServiceStatus {
  'active',
  'inactive'
}

export const ServiceStatuses = [
  {
    label: 'Available',
    value: 'active',
    color: 'success'
  },
  {
    label: 'Unavailable',
    value: 'inactive',
    color: 'danger'
  }
];

export interface Service extends Base {
  uniqueId: string;
  name: string;
  description: string;
  summary: string;
  price: number;
  duration: number;
  status: ServiceStatus;
  type: ServiceType;
  data: Record<string, string>;
  image?: string;
}

export interface CountryProps {
  id: number;
  name: string;
  iso2: string;
  iso3: string;
  phonecode: string;
  capital: string;
  currency: string;
  native: string;
  emoji: string;
}

export interface StateProps {
  id: number;
  name: string;
  country_id: number;
  country_code: string;
  iso2: string;
  type: string;
  latitude: string;
  longitude: string;
}

export interface CityProps {
  id: number;
  name: string;
}

export interface MailOptionsProps {
  from: {
    name: string;
    address: string;
  };
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export interface Newsletter extends Base {
  email: string;
}

export interface Guest {
  name: string;
  connection: string;
  phone: string;
}

export interface Appointment extends Base {
  uid: number;
  name: string;
  phone: string;
  email: string;
  guests: Guest[];
  notes: string;
  date: Date | string;
  doctor: number;
  progerss: number;
  type: 'online' | 'offline';
  aid: number;
  status:
    | 'booked'
    | 'confirmed'
    | 'in-progress'
    | 'completed'
    | 'cancelled'
    | 'overdue'
    | 'on-hold';
}
