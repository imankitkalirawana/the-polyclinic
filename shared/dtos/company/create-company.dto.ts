import { z } from 'zod';
import { CompanyType } from '../../enums';
import { nameValidation, nullableStringValidation } from '../factory.dto';

export const createCompanySchema = z.object({
  name: nameValidation,

  company_code: nullableStringValidation,

  company_type: z.enum(CompanyType),

  schema: nullableStringValidation,

  currency: nullableStringValidation,

  time_zone: nullableStringValidation,
});

export type CreateCompanyDto = z.infer<typeof createCompanySchema>;
