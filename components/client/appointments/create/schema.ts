import { z } from 'zod';
import { APPOINTMENT_TYPES, APPOINTMENT_MODES } from '@/services/client/appointment/constants';

export const createAppointmentFormSchema = z.object({
  appointment: z.object({
    patientId: z.string().min(1, 'Patient ID is required'),
    doctorId: z.string().optional(),
    date: z.date().refine((date) => date > new Date(), {
      message: 'Appointment date must be in the future',
    }),
    type: z.enum(
      APPOINTMENT_TYPES.map((type) => type.value) as [string, ...string[]],
      { errorMap: () => ({ message: 'Invalid appointment type' }) }
    ),
    additionalInfo: z.object({
      mode: z.enum(APPOINTMENT_MODES as [string, ...string[]], { 
        errorMap: () => ({ message: 'Invalid appointment mode' }) 
      }),
      notes: z.string().max(500).optional(),
      symptoms: z.string().max(500).optional(),
      description: z.string().max(1000).optional(),
      instructions: z.string().max(1000).optional(),
    }),
    previousAppointment: z.string().optional(),
  }),
  meta: z.object({
    currentStep: z.number().min(0).max(4),
    showConfirmation: z.boolean(),
    showReceipt: z.boolean(),
    createNewPatient: z.boolean(),
    knowYourDoctor: z.boolean(),
  }),
});

export type CreateAppointmentFormValues = z.infer<typeof createAppointmentFormSchema>;