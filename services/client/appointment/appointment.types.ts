import { $FixMe, Base } from '@/types';
import { ValuesOf } from '@/libs/utils';
import {
  APPOINTMENT_MODES,
  APPOINTMENT_STATUSES,
  APPOINTMENT_TYPES,
} from './appointment.constants';
import { Role } from '@/services/common/user/user.constants';
import { ButtonProps } from '@heroui/react';
import { GENDERS } from '@/libs/constants';

type PatientInfo = {
  uid: string;
  name: string;
  phone?: string;
  email: string;
  gender?: GENDERS;
  age?: number;
  image?: string;
};

type DoctorInfo = {
  uid: string;
  name: string;
  email: string;
  phone: string;
  seating?: string;
  image?: string;
};

export type AppointmentType = Base & {
  aid: string;
  date: string | Date;
  patient: PatientInfo;
  doctor?: DoctorInfo;
  status: AppointmentStatus;
  additionalInfo: {
    notes?: string;
    symptoms?: string;
    type: AppointmentMode;
    description?: string;
    instructions?: string;
  };
  cancellation?: {
    remarks?: string;
    date?: string;
    by?: {
      name?: string;
      email?: string;
      uid?: string;
    };
  };
  progress?: number;
  data?: Record<string, string>;
  type: AppointmentTypes;
  previousAppointment?: string;
};

export type ActionType =
  | 'reschedule'
  | 'cancel'
  | 'delete'
  | 'reminder'
  | 'add-to-calendar'
  | 'bulk-cancel'
  | 'bulk-delete'
  | 'new-tab';

export type DropdownKeyType = 'invoice' | 'reports' | 'edit' | 'delete';

export type ButtonConfig = {
  key: string;
  label: string;
  icon: string;
  color: ButtonProps['color'];
  variant: ButtonProps['variant'];
  position: 'left' | 'right';
  isIconOnly?: boolean;
  whileLoading?: string;
  visibilityRules: {
    statuses?: AppointmentType['status'][];
    roles?: Role[];
    custom?: (appointment: AppointmentType, role: Role) => boolean;
  };
  action: {
    type: 'store-action' | 'async-function' | 'navigation';
    payload?: $FixMe;
    handler?: (appointment: AppointmentType) => Promise<void> | void;
    url?: (appointment: AppointmentType) => string;
  };
  content?: React.ComponentType<{
    appointment: AppointmentType;
    onClose: () => void;
  }>;
};

export type ProcessedButton = {
  key: string;
  children: string;
  startContent: React.ReactNode;
  color: ButtonProps['color'];
  variant: ButtonProps['variant'];
  position: 'left' | 'right';
  isIconOnly?: boolean;
  whileLoading?: string;
  isHidden: boolean;
  onPress: () => Promise<void> | void;
  content?: React.ReactNode;
};

export type AppointmentStatus = ValuesOf<typeof APPOINTMENT_STATUSES>;
export type AppointmentMode = ValuesOf<typeof APPOINTMENT_MODES>;
export type AppointmentTypes = ValuesOf<typeof APPOINTMENT_TYPES>[`value`];

export type CreateAppointmentType = {
  patientId: string;
  date: Date;
  type: 'consultation' | 'follow_up' | 'emergency';
  additionalInfo: {
    mode: 'online' | 'offline';
    notes?: string | undefined;
    symptoms?: string | undefined;
    description?: string | undefined;
    instructions?: string | undefined;
  };
  doctorId?: string | undefined;
  previousAppointment?: string | undefined;
};
