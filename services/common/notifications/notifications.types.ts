import { z } from 'zod';
import { Base } from '@/types';
import { ValuesOf } from '@/libs/utils';
import {
  NOTIFICATION_TYPES,
  NOTIFICATION_STATUSES,
  NOTIFICATION_PRIORITIES,
} from './notifications.constants';
import { createNotificationSchema, updateNotificationSchema } from './notifications.validation';
import { AxiosRequestConfig } from 'axios';
import { ButtonProps } from '@heroui/react';

export type NotificationType = ValuesOf<typeof NOTIFICATION_TYPES>;
export type NotificationStatus = ValuesOf<typeof NOTIFICATION_STATUSES>;
export type NotificationPriority = ValuesOf<typeof NOTIFICATION_PRIORITIES>;

export type NotificationActions = {
  type: 'button' | 'link';
  label: string;
  href?: string;
  onClick?: () => void;
};

export type ExecutedAction = {
  action: string;
  executedAt?: Date | undefined;
  executedBy?: string | undefined;
};

export type NotificationAction = {
  isVisible: boolean;
  label: string;
  action: string;
  url: string;
  color: ButtonProps['color'];
  method: AxiosRequestConfig['method'];
  body?: Record<string, unknown>;
  icon?: string;
};

export type Notification = Base & {
  nid: string;
  uid: string; // recipient uid
  type: NotificationType;
  message: string;
  title?: string;
  status: NotificationStatus;
  priority?: NotificationPriority;
  metadata?: Record<string, unknown>; // additional data for specific notification types
  readAt?: Date;
  actions?: NotificationAction[];
  executedActions?: ExecutedAction[];
};

export type CreateNotification = z.infer<typeof createNotificationSchema>;
export type UpdateNotification = z.infer<typeof updateNotificationSchema>;

// Event payloads for notification triggers
export type AppointmentNotificationPayload = {
  appointmentId: string;
  patientId: string;
  doctorId: string;
  patientName: string;
  doctorName: string;
  appointmentDate: Date;
  appointmentTime: string;
  reason?: string;
};

export type NotificationEventPayload = {
  type:
    | 'appointment.booked'
    | 'appointment.confirmed'
    | 'appointment.cancelled'
    | 'appointment.updated';
  data: AppointmentNotificationPayload;
};

export type GetAllNotificationsResponse = {
  notifications: Notification[];
  stats: {
    total: number;
    unread: number;
    read: number;
  };
};
