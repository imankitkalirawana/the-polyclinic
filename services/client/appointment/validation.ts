import { z } from 'zod';
import { APPOINTMENT_TYPES, APPOINTMENT_MODES } from './constants';

export const appointmentSchema = z.object({
  patientId: z.string({ error: 'Invalid patient ID' }).min(1, { error: 'Patient ID is required' }),
  doctorId: z.string({ error: 'Invalid doctor ID' }).optional(),
  date: z.date().refine((date) => date > new Date(), {
    message: 'Appointment date must be in the future',
  }),
  type: z.enum(
    APPOINTMENT_TYPES.map((type) => type.value),
    { error: 'Invalid appointment type' }
  ),
  additionalInfo: z.object({
    mode: z.enum(APPOINTMENT_MODES, { error: 'Invalid appointment mode' }),
    notes: z.string().max(500).optional(),
    symptoms: z.string().max(500).optional(),
    description: z.string().max(1000).optional(),
    instructions: z.string().max(1000).optional(),
  }),
  previousAppointment: z.string().optional(),
});
