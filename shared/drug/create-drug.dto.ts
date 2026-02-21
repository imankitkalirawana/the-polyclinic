import { nameValidation, nullableStringValidation } from '../factory.dto';
import { DrugForm, DrugScheduleType } from '@enums/drug.enum';
import { z } from 'zod';

export const createDrugSchema = z.object({
  name: nameValidation,
  generic_name: nullableStringValidation,
  strength: nullableStringValidation,
  form: z.enum(DrugForm),
  description: nullableStringValidation,
  manufacturer: nullableStringValidation,
  schedule_type: z.enum(DrugScheduleType),
});

export type CreateDrugDto = z.input<typeof createDrugSchema>;
