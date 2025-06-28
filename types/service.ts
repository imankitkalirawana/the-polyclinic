import { Base } from '@/lib/interface';

export enum ServiceStatus {
  active = 'active',
  inactive = 'inactive',
}

export enum ServiceTypes {
  medical = 'medical',
  surgical = 'surgical',
  diagnostic = 'diagnostic',
  consultation = 'consultation',
}

export type ServiceData = {
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
  data: ServiceData;
  image?: string;
}
