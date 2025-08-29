// TODO: Remove this file after moving to @/services
import { ButtonProps } from '@heroui/react';

import type { $FixMe, Gender } from '..';

import { OrganizationUserType } from '../system/organization';
import { AppointmentType } from '@/services/client/appointment';

export const appointmentTypes = [
  {
    label: 'Consultation',
    value: 'consultation',
    description:
      'A consultation is a visit to a doctor for a general check-up or to discuss a specific health concern.',
  },
  {
    label: 'Follow-up',
    value: 'follow-up',
    description:
      'A follow-up is a visit to a doctor to check on the progress of a specific health concern.',
  },
  {
    label: 'Emergency',
    value: 'emergency',
    description: 'An emergency is a visit to a doctor for a sudden and urgent health concern.',
  },
] as const;

export const appointmentModes = ['online', 'offline'] as const;

export interface PatientInfo {
  uid: number;
  name: string;
  phone?: string;
  email: string;
  gender?: Gender;
  age?: number;
  image?: string;
}

export interface DoctorInfo {
  uid: number;
  name: string;
  email: string;
  phone: string;
  seating?: string;
  image?: string;
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
    roles?: OrganizationUserType['role'][];
    custom?: (appointment: AppointmentType, role: OrganizationUserType['role']) => boolean;
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
