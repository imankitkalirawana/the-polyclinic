import { nameValidation, nullableStringValidation } from '../factory.dto';
import { z } from 'zod';

export const createSpecializationSchema = z.object({
  name: nameValidation,
  description: nullableStringValidation.optional(),
});

export type CreateSpecializationDto = z.infer<typeof createSpecializationSchema>;
