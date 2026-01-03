import { z } from 'zod';
import { createDepartmentSchema, updateDepartmentSchema } from './department.validation';
import { Base } from '@/types';
import { DoctorType } from '../doctor';

export type CreateDepartmentType = z.infer<typeof createDepartmentSchema>;
export type UpdateDepartmentType = z.infer<typeof updateDepartmentSchema>;

export type DepartmentType = CreateDepartmentType &
  Base & {
    did: string;
    status: 'active' | 'inactive';
    team?: Array<Pick<DoctorType, 'id' | 'name' | 'email' | 'phone' | 'image'>>;
  };
