import { z } from 'zod';
import { createCompanySchema } from './create-company.dto';

export const updateCompanySchema = createCompanySchema.partial();

export type UpdateCompanyDto = z.infer<typeof updateCompanySchema>;
