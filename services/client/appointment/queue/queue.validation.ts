import { z } from 'zod';
import { QueueStatus } from './queue.types';

/**
 * Schema for API filter payload (date as ISO date strings).
 * Use when validating or serializing filters before sending to the API.
 */
export const appointmentQueueFiltersPayloadSchema = z.object({
  date: z.object({
    start: z.string().nullable(),
    end: z.string().nullable(),
  }),
  status: z.array(z.nativeEnum(QueueStatus)).optional(),
  doctorId: z.string().nullable().optional(),
});

export type AppointmentQueueFiltersPayloadInput = z.infer<
  typeof appointmentQueueFiltersPayloadSchema
>;
