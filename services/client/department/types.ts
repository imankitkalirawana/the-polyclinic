import { z } from 'zod';
import { createDepartmentSchema, updateDepartmentSchema } from './validation';
import { Base } from '@/types';

export type CreateDepartmentType = z.infer<typeof createDepartmentSchema>;
export type UpdateDepartmentType = z.infer<typeof updateDepartmentSchema>;

export type DepartmentType = Base &
  CreateDepartmentType & {
    slug: string;
  };
