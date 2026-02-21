import { z } from 'zod';
import { PaymentMode } from '../../../enums';
import { nullableStringValidation } from '../../factory.dto';

export const createQueueSchema = z.object({
  patientId: z.uuid(),

  doctorId: z.uuid(),

  paymentMode: z.enum(PaymentMode),

  appointmentDate: z.coerce.date(),

  notes: nullableStringValidation,
});

export type CreateQueueDto = z.infer<typeof createQueueSchema>;
