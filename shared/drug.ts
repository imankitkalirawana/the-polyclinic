import { Base } from './common';
import { DrugStatus } from '../enums';

export type Drug = Base & {
  unique_id: number;
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
};
