import { Base } from '@/libs/interface';

export enum DrugStatus {
  available = 'available',
  unavailable = 'unavailable',
}

export interface DrugType extends Base {
  did: number;
  brandName: string;
  genericName: string;
  description?: string;
  manufacturer?: string;
  dosage?: string;
  form?: string;
  frequency?: string;
  strength?: number;
  quantity?: number;
  price?: number;
  status: DrugStatus;
  stock?: number;
}
