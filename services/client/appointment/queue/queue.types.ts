import { GENDERS } from '@/libs/constants';
import { CalendarDate, parseDate } from '@internationalized/date';

export enum QueueStatus {
  PAYMENT_PENDING = 'PAYMENT_PENDING',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  BOOKED = 'BOOKED',
  CALLED = 'CALLED',
  IN_CONSULTATION = 'IN_CONSULTATION',
  SKIPPED = 'SKIPPED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export type PatientInfo = {
  id: string;
  user_id: string;
  name: string;
  phone?: string;
  email: string;
  gender?: GENDERS;
  age?: number;
  image?: string;
};

export type DoctorInfo = {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone?: string;
  image?: string;
  seating?: string;
};

export type UserInfo = {
  id: string;
  email: string;
  name: string;
};

export type PaymentMode = 'RAZORPAY' | 'CASH';

export type AppointmentQueueRequest = {
  queueId?: string | null;
  patientId: string;
  doctorId: string;
  appointmentDate: Date | null;
  paymentMode: PaymentMode;
  notes?: string | null;
};

export type CreateAppointmentQueueFormValues = {
  appointment: AppointmentQueueRequest & { queueId?: string | null };
  meta: {
    currentStep: number;
    showConfirmation: boolean;
    showReceipt: boolean;
    createNewPatient: boolean;
  };
};

export type VerifyPaymentRequest = {
  orderId: string;
  paymentId: string;
  signature: string;
};

export type PaymentDetails = { payment: { orderId: string; amount: number; currency: string } };

export type AppointmentQueueType = {
  id: string;
  aid: string;
  paymentMode: PaymentMode;
  sequenceNumber: number;
  title: string;
  notes: string;
  appointmentDate: string;
  prescription: string;
  status: QueueStatus;
  patient: PatientInfo;
  doctor: DoctorInfo;
  bookedByUser: UserInfo;
  completedByUser?: UserInfo;
  createdAt: string;
  updatedAt: string;
  previousQueueId?: string;
  nextQueueId?: string;
};

/** Form/UI filter state – uses CalendarDate for date inputs */
export type AppointmentQueueFilters = {
  date: {
    start: CalendarDate | null;
    end: CalendarDate | null;
  };
  /** Filter by one or more queue statuses */
  status?: QueueStatus[];
  /** Filter by doctor (user) id */
  doctorId?: string | null;
};

/** API request payload – date range as ISO date strings */
export type AppointmentQueueFiltersPayload = {
  date: {
    start: string | null;
    end: string | null;
  };
  status?: QueueStatus[];
  doctorId?: string | null;
};

/** Default empty filter values for forms and reset */
export const DEFAULT_APPOINTMENT_QUEUE_FILTERS: AppointmentQueueFilters = {
  date: { start: null, end: null },
  status: undefined,
  doctorId: null,
};

/** Filters as returned from API (date range may be ISO strings) */
export type AppointmentQueueFiltersFromApi = Omit<AppointmentQueueFilters, 'date'> & {
  date: {
    start: CalendarDate | string | null;
    end: CalendarDate | string | null;
  };
};

/**
 * Normalize API filter response to form/UI shape (CalendarDate).
 * Use when initializing filter form from API response.
 */
export function normalizeFiltersFromApi(
  fromApi: AppointmentQueueFiltersFromApi | undefined
): AppointmentQueueFilters {
  if (!fromApi) return DEFAULT_APPOINTMENT_QUEUE_FILTERS;
  const start = fromApi.date?.start;
  const end = fromApi.date?.end;
  return {
    ...fromApi,
    date: {
      start: start == null ? null : typeof start === 'string' ? parseDate(start) : start,
      end: end == null ? null : typeof end === 'string' ? parseDate(end) : end,
    },
  };
}

export type AppointmentQueueMetaData = {
  total: number;
};
