interface Base {
  _id: string;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  'admin',
  'doctor',
  'nurse',
  'receptionist',
  'pharmacist',
  'laboratorist',
  'user'
}

export enum UserStatus {
  'active',
  'inactive',
  'blocked',
  'deleted'
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
