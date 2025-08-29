import { z } from 'zod';
import { appointmentSchema } from '@/services/client/appointment/validation';

export type CreateAppointmentType = z.infer<typeof appointmentSchema>;
