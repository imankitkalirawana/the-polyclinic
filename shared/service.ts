import { Base } from './common';
import { ServiceStatus, ServiceType } from '../enums';

export type ServiceFields = {
  [key: `cell-${number}-${number}`]: string;
};

export type Service = Base & {
  uniqueId: string;
  name: string;
  description: string;
  summary: string;
  price: number;
  duration: number;
  status: ServiceStatus;
  type: ServiceType;
  fields: ServiceFields;
  image?: string;
};
