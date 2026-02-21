import { z } from 'zod';
import { nullableStringValidation } from '../../factory.dto';

export const completeQueueSchema = z.object({
  title: nullableStringValidation,
  prescription: nullableStringValidation,
});

export type CompleteQueueDto = z.infer<typeof completeQueueSchema>;
