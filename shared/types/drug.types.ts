import { Base } from './common.types';
import { DrugForm, DrugScheduleType } from '../enums';

export type Drug = Base & {
  unique_id: string;
  name: string;
  generic_name: string;
  strength?: string;
  form?: DrugForm;
  description?: string;
  manufacturer?: string;
  schedule_type?: DrugScheduleType;
  companies?: string[];
};
