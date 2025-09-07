import { z } from 'zod';
import { createAppointmentSchema } from '@/services/client/appointment/validation';
import { $FixMe, Base, Gender } from '@/types';
import { ValuesOf } from '@/lib/utils';
import { APPOINTMENT_MODES, APPOINTMENT_STATUSES, APPOINTMENT_TYPES } from './constants';
import { OrganizationUser } from '@/services/common/user';
import { ButtonProps } from '@heroui/react';

interface PatientInfo {
  uid: number;
  name: string;
  phone?: string;
  email: string;
  gender?: Gender;
  age?: number;
  image?: string;
}

interface DoctorInfo {
  uid: number;
  name: string;
  email: string;
  phone: string;
  seating?: string;
  image?: string;
}

export interface AppointmentType extends Base {
  aid: number;
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
  progress?: number;
  data?: Record<string, string>;
  type: AppointmentTypes;
  previousAppointment?: string;
}

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

export interface ButtonConfig {
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
    roles?: OrganizationUser['role'][];
    custom?: (appointment: AppointmentType, role: OrganizationUser['role']) => boolean;
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
}

export interface ProcessedButton {
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
}

export type AppointmentStatus = ValuesOf<typeof APPOINTMENT_STATUSES>;
export type AppointmentMode = ValuesOf<typeof APPOINTMENT_MODES>;
export type AppointmentTypes = ValuesOf<typeof APPOINTMENT_TYPES>[`value`];

// Zod
export type CreateAppointmentType = z.infer<typeof createAppointmentSchema>;
