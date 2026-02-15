import { Base } from '@/libs/interface';

export enum ServiceStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum ServiceTypes {
  medical = 'medical',
  surgical = 'surgical',
  diagnostic = 'diagnostic',
  consultation = 'consultation',
}

export type ServiceFields = {
  [key: `cell-${number}-${number}`]: string;
};
export interface ServiceType extends Base {
  uniqueId: string;
  name: string;
  description: string;
  summary: string;
  price: number;
  duration: number;
  status: ServiceStatus;
  type: ServiceTypes;
  fields: ServiceFields;
  image?: string;
}
